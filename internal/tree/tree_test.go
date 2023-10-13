package tree

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestInsert(t *testing.T) {
	tree := NewTree()
	tree.Insert(10)
	tree.Insert(2)
	tree.Insert(4)
	tree.Insert(6)

	outs := tree.InorderTreeWalk()

	assert.Equal(t, 2, outs[0])
	assert.Equal(t, 4, outs[1])
	assert.Equal(t, 6, outs[2])
	assert.Equal(t, 10, outs[3])
}
