package tree

type node struct {
	left   *node
	right  *node
	parent *node
	key    int64
}

func (n *node) Walk(res []int64) {
	if n != nil {
		n.left.Walk(res)
		res = append(res, n.key)
		n.right.Walk(res)
	}
}

func newNode(key int64) *node {
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

func (t *Tree) Insert(key int64) {
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

func (t *Tree) InorderTreeWalk() []int64 {
	var res []int64
	t.root.Walk(res)
	return res
}
