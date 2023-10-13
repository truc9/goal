package tree

type node struct {
	left   *node
	right  *node
	parent *node
	key    int
}

func (n *node) Walk(arr *[]int) {
	if n != nil {
		n.left.Walk(arr)
		*arr = append(*arr, n.key)
		n.right.Walk(arr)
	}
}

func newNode(key int) *node {
	return &node{
		left:  nil,
		right: nil,
		key:   key,
	}
}

type Tree struct {
	root *node
}

func NewTree() *Tree {
	return &Tree{
		root: nil,
	}
}

func (t *Tree) Insert(key int) {
	// inserting node
	var z *node = newNode(key)

	// node compare with z
	var x *node = t.root

	// parent of z
	var y *node = nil

	// keep progressing until leaf
	for x != nil {
		y = x
		if z.key < x.key {
			// shift x to its left
			x = x.left
		} else {
			// shift x to its right
			x = x.right
		}
	}

	z.parent = y

	if y == nil {
		// empty tree
		t.root = z
	} else if z.key < y.key {
		// become left child of y if key is less than
		y.left = z
	} else {
		// become right child of y if key is greater
		y.right = z
	}
}

func (t *Tree) InorderTreeWalk() []int {
	var arr []int
	t.root.Walk(&arr)
	return arr
}
