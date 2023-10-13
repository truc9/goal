package main

import (
	"log"

	"github.com/truc9/goal/internal/tree"
)

func main() {
	t := tree.NewTree()
	t.Insert(3)
	t.Insert(2)
	t.Insert(22)
	t.Insert(1)
	t.Insert(7)
	res := t.InorderTreeWalk()
	log.Println(res)
}
