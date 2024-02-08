package main

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	router.Use(cors.New(config))

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	router.GET("/sse", sendEvent)

	router.Run() // listen and serve on 0.0.0.0:8080
}

func asyncConnection(c *gin.Context) {

	max := 20
	counter := 0

	for range time.Tick(time.Millisecond * 500) {
		counter++

		if counter > max {
			return
		}

		c.SSEvent("message", map[string]interface{}{
			"counter": counter,
			"max":     max,
		})
		c.Writer.Flush()
	}
}

func sendEvent(c *gin.Context) {

	asyncConnection(c)

	c.SSEvent("message", "hi")

	// Flush the response to ensure the data is sent immediately
	c.Writer.Flush()

}
