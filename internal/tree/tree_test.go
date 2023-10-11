package tree

import (
	"log"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestInsert(t *testing.T) {
	tree := NewTree()
	tree.Insert(10)
	tree.Insert(2)
	tree.Insert(4)
	tree.Insert(6)
	res := tree.InorderTreeWalk()

	expected := [4]int64{2, 4, 6, 10}
	for val, i := range expected {
		log.Print(val)
		log.Print(i)
		assert.Equal(t, val, res[i])
	}
}
