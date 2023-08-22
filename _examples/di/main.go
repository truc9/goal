package main

import (
	"fmt"
	"os"
)

func main() {
	s, err := InitializeService()
	if err != nil {
		fmt.Printf("failed to InitializeService: %s\n", err)
		os.Exit(2)
	}

	res, rs := s.Check()
	fmt.Println(res)
	fmt.Println(rs)
}
