import { describe, it, expect } from 'vitest'
import {
  listToTree,
  treeToList,
  findNode,
  findNodeAll,
  findPath,
  findPathAll,
  filter,
  forEach,
  treeMap,
  treeMapEach,
  eachTree
} from '../../src/utils/tree'

describe('Tree Utils', () => {
  const sampleList = [
    { id: 1, name: 'Root 1', pid: 0 },
    { id: 2, name: 'Child 1.1', pid: 1 },
    { id: 3, name: 'Child 1.2', pid: 1 },
    { id: 4, name: 'Root 2', pid: 0 },
    { id: 5, name: 'Child 1.1.1', pid: 2 },
    { id: 6, name: 'Child 1.1.2', pid: 2 }
  ]

  const sampleTree = [
    {
      id: 1,
      name: 'Root 1',
      pid: 0,
      children: [
        {
          id: 2,
          name: 'Child 1.1',
          pid: 1,
          children: [
            { id: 5, name: 'Child 1.1.1', pid: 2, children: [] },
            { id: 6, name: 'Child 1.1.2', pid: 2, children: [] }
          ]
        },
        { id: 3, name: 'Child 1.2', pid: 1, children: [] }
      ]
    },
    { id: 4, name: 'Root 2', pid: 0, children: [] }
  ]

  describe('listToTree', () => {
    it('should convert flat list to tree structure', () => {
      const result = listToTree(sampleList)

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe(1)
      expect(result[0].children).toHaveLength(2)
      expect(result[0].children[0].id).toBe(2)
      expect(result[0].children[0].children).toHaveLength(2)
      expect(result[1].id).toBe(4)
      expect(result[1].children).toHaveLength(0)
    })

    it('should work with custom configuration', () => {
      const customList = [
        { key: 1, title: 'Root', parentKey: 0 },
        { key: 2, title: 'Child', parentKey: 1 }
      ]

      const result = listToTree(customList, {
        id: 'key',
        children: 'items',
        pid: 'parentKey'
      })

      expect(result[0].items).toHaveLength(1)
      expect(result[0].items[0].key).toBe(2)
    })

    it('should handle empty list', () => {
      const result = listToTree([])
      expect(result).toEqual([])
    })

    it('should handle list with no root items', () => {
      const orphanList = [
        { id: 2, name: 'Child', pid: 1 },
        { id: 3, name: 'Child 2', pid: 1 }
      ]

      const result = listToTree(orphanList)
      expect(result).toHaveLength(0)
    })

    it('should handle items with missing parents', () => {
      const mixedList = [
        { id: 1, name: 'Root', pid: 0 },
        { id: 3, name: 'Orphan', pid: 2 } // parent id 2 doesn't exist
      ]

      const result = listToTree(mixedList)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(1)
    })
  })

  describe('treeToList', () => {
    it('should convert tree to flat list', () => {
      const result = treeToList(sampleTree)

      expect(result).toHaveLength(6)
      expect(result.map((item) => item.id)).toEqual([1, 2, 5, 6, 3, 4])
    })

    it('should work with custom children field', () => {
      const customTree = [
        {
          id: 1,
          name: 'Root',
          items: [{ id: 2, name: 'Child', items: [] }]
        }
      ]

      const result = treeToList(customTree, { children: 'items' })

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe(1)
      expect(result[1].id).toBe(2)
    })

    it('should handle empty tree', () => {
      const result = treeToList([])
      expect(result).toEqual([])
    })
  })

  describe('findNode', () => {
    it('should find node by condition', () => {
      const result = findNode(sampleTree, (node) => node.id === 5)

      expect(result).toBeTruthy()
      expect(result.id).toBe(5)
      expect(result.name).toBe('Child 1.1.1')
    })

    it('should return null if node not found', () => {
      const result = findNode(sampleTree, (node) => node.id === 999)

      expect(result).toBeNull()
    })

    it('should work with custom children field', () => {
      const customTree = [
        {
          id: 1,
          items: [{ id: 2, items: [] }]
        }
      ]

      const result = findNode(customTree, (node) => node.id === 2, { children: 'items' })

      expect(result).toBeTruthy()
      expect(result.id).toBe(2)
    })

    it('should find root node', () => {
      const result = findNode(sampleTree, (node) => node.id === 1)

      expect(result).toBeTruthy()
      expect(result.id).toBe(1)
    })
  })

  describe('findNodeAll', () => {
    it('should find all nodes matching condition', () => {
      const result = findNodeAll(sampleTree, (node) => node.name.includes('Child'))

      expect(result).toHaveLength(4)
      expect(result.map((node) => node.id)).toEqual([2, 5, 6, 3])
    })

    it('should return empty array if no nodes found', () => {
      const result = findNodeAll(sampleTree, (node) => node.id === 999)

      expect(result).toEqual([])
    })

    it('should find all nodes', () => {
      const result = findNodeAll(sampleTree, () => true)

      expect(result).toHaveLength(6)
    })
  })

  describe('findPath', () => {
    it('should find path to node', () => {
      const result = findPath(sampleTree, (node) => node.id === 5)

      expect(result).toHaveLength(3)
      expect(result.map((node) => node.id)).toEqual([1, 2, 5])
    })

    it('should return null if node not found', () => {
      const result = findPath(sampleTree, (node) => node.id === 999)

      expect(result).toBeNull()
    })

    it('should find path to root node', () => {
      const result = findPath(sampleTree, (node) => node.id === 1)

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(1)
    })

    it('should work with custom children field', () => {
      const customTree = [
        {
          id: 1,
          items: [
            {
              id: 2,
              items: [{ id: 3, items: [] }]
            }
          ]
        }
      ]

      const result = findPath(customTree, (node) => node.id === 3, { children: 'items' })

      expect(result).toHaveLength(3)
      expect(result.map((node) => node.id)).toEqual([1, 2, 3])
    })
  })

  describe('findPathAll', () => {
    it('should find all paths to matching nodes', () => {
      const result = findPathAll(sampleTree, (node) => node.name.includes('1.1'))

      expect(result).toHaveLength(3) // Child 1.1, Child 1.1.1, Child 1.1.2
      expect(result[0].map((node) => node.id)).toEqual([1, 2]) // Path to Child 1.1
      expect(result[1].map((node) => node.id)).toEqual([1, 2, 5]) // Path to Child 1.1.1
      expect(result[2].map((node) => node.id)).toEqual([1, 2, 6]) // Path to Child 1.1.2
    })

    it('should return empty array if no nodes found', () => {
      const result = findPathAll(sampleTree, (node) => node.id === 999)

      expect(result).toEqual([])
    })

    it('should work with root nodes', () => {
      const result = findPathAll(sampleTree, (node) => node.pid === 0)

      expect(result).toHaveLength(2)
      expect(result[0].map((node) => node.id)).toEqual([1])
      expect(result[1].map((node) => node.id)).toEqual([4])
    })
  })

  describe('filter', () => {
    it('should filter tree and keep matching nodes and their ancestors', () => {
      const result = filter(sampleTree, (node) => node.name.includes('1.1.1'))

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(1)
      expect(result[0].children).toHaveLength(1)
      expect(result[0].children[0].id).toBe(2)
      expect(result[0].children[0].children).toHaveLength(1)
      expect(result[0].children[0].children[0].id).toBe(5)
    })

    it('should return empty array if no matches', () => {
      const result = filter(sampleTree, (node) => node.id === 999)

      expect(result).toEqual([])
    })

    it('should work with custom children field', () => {
      const customTree = [
        {
          id: 1,
          items: [{ id: 2, name: 'target', items: [] }]
        }
      ]

      const result = filter(customTree, (node) => node.name === 'target', { children: 'items' })

      expect(result).toHaveLength(1)
      expect(result[0].items).toHaveLength(1)
      expect(result[0].items[0].id).toBe(2)
    })

    it('should keep nodes with matching children', () => {
      const result = filter(sampleTree, (node) => node.id === 5 || node.id === 1)

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(1)
    })
  })

  describe('forEach', () => {
    it('should iterate through all nodes', () => {
      const visitedIds = []
      forEach(sampleTree, (node) => {
        visitedIds.push(node.id)
      })

      expect(visitedIds).toEqual([1, 2, 5, 6, 3, 4])
    })

    it('should stop iteration when function returns true', () => {
      const visitedIds = []
      forEach(sampleTree, (node) => {
        visitedIds.push(node.id)
        return node.id === 2 // Stop at node 2
      })

      expect(visitedIds).toEqual([1, 2])
    })

    it('should work with custom children field', () => {
      const customTree = [
        {
          id: 1,
          items: [{ id: 2, items: [] }]
        }
      ]
      const visitedIds = []

      forEach(
        customTree,
        (node) => {
          visitedIds.push(node.id)
        },
        { children: 'items' }
      )

      expect(visitedIds).toEqual([1, 2])
    })

    it('should handle empty tree', () => {
      const visitedIds = []
      forEach([], (node) => {
        visitedIds.push(node.id)
      })

      expect(visitedIds).toEqual([])
    })
  })

  describe('treeMap', () => {
    it('should transform tree structure', () => {
      const result = treeMap(sampleTree, {
        conversion: (node) => ({
          key: node.id,
          title: node.name,
          value: node.id
        })
      })

      expect(result[0].key).toBe(1)
      expect(result[0].title).toBe('Root 1')
      expect(result[0].children[0].key).toBe(2)
      expect(result[0].children[0].title).toBe('Child 1.1')
    })

    it('should work with custom children field', () => {
      const customTree = [
        {
          id: 1,
          name: 'Root',
          items: [{ id: 2, name: 'Child', items: [] }]
        }
      ]

      const result = treeMap(customTree, {
        children: 'items',
        conversion: (node) => ({
          key: node.id,
          title: node.name
        })
      })

      expect(result[0].key).toBe(1)
      expect(result[0].items[0].key).toBe(2)
    })

    it('should handle nodes without children', () => {
      const simpleTree = [{ id: 1, name: 'Simple' }]

      const result = treeMap(simpleTree, {
        conversion: (node) => ({ key: node.id })
      })

      expect(result[0].key).toBe(1)
      expect(result[0].children).toBeUndefined()
    })
  })

  describe('treeMapEach', () => {
    it('should transform single node with children', () => {
      const node = {
        id: 1,
        name: 'Root',
        children: [{ id: 2, name: 'Child', children: [] }]
      }

      const result = treeMapEach(node, {
        conversion: (n) => ({ key: n.id, title: n.name })
      })

      expect(result.key).toBe(1)
      expect(result.title).toBe('Root')
      expect(result.children[0].key).toBe(2)
      expect(result.children[0].title).toBe('Child')
    })

    it('should transform single node without children', () => {
      const node = { id: 1, name: 'Leaf' }

      const result = treeMapEach(node, {
        conversion: (n) => ({ key: n.id, title: n.name })
      })

      expect(result.key).toBe(1)
      expect(result.title).toBe('Leaf')
      expect(result.children).toBeUndefined()
    })

    it('should work with custom children field', () => {
      const node = {
        id: 1,
        items: [{ id: 2, items: [] }]
      }

      const result = treeMapEach(node, {
        children: 'items',
        conversion: (n) => ({ key: n.id })
      })

      expect(result.key).toBe(1)
      expect(result.items[0].key).toBe(2)
    })
  })

  describe('eachTree', () => {
    it('should traverse tree with callback', () => {
      const visitedNodes = []
      const parentNodes = []

      eachTree(sampleTree, (node, parent) => {
        visitedNodes.push(node.id)
        parentNodes.push(parent.id || 'root')
        return node
      })

      expect(visitedNodes).toEqual([1, 2, 5, 6, 3, 4])
      expect(parentNodes).toEqual(['root', 1, 2, 2, 1, 'root'])
    })

    it('should allow node transformation', () => {
      const transformedTree = [...sampleTree]

      eachTree(transformedTree, (node) => {
        return { ...node, visited: true }
      })

      // Original tree should not be modified, but callback received the nodes
      expect(transformedTree[0].visited).toBeUndefined()
    })

    it('should handle empty tree', () => {
      const visitedNodes = []

      eachTree([], (node) => {
        visitedNodes.push(node.id)
        return node
      })

      expect(visitedNodes).toEqual([])
    })

    it('should provide correct parent context', () => {
      const parentChildPairs = []

      eachTree(sampleTree, (node, parent) => {
        parentChildPairs.push({
          childId: node.id,
          parentId: parent.id || null
        })
        return node
      })

      expect(parentChildPairs).toContainEqual({ childId: 2, parentId: 1 })
      expect(parentChildPairs).toContainEqual({ childId: 5, parentId: 2 })
      expect(parentChildPairs).toContainEqual({ childId: 1, parentId: null })
    })
  })

  describe('Edge Cases', () => {
    it('should handle circular references gracefully', () => {
      const circularList = [
        { id: 1, name: 'Node 1', pid: 2 },
        { id: 2, name: 'Node 2', pid: 1 }
      ]

      // This should not cause infinite loop
      const result = listToTree(circularList)
      expect(result).toHaveLength(0) // No root nodes
    })

    it('should handle very deep trees', () => {
      const deepList = []
      for (let i = 1; i <= 100; i++) {
        deepList.push({
          id: i,
          name: `Node ${i}`,
          pid: i === 1 ? 0 : i - 1
        })
      }

      const result = listToTree(deepList)
      expect(result).toHaveLength(1)

      // Check depth
      let current = result[0]
      let depth = 1
      while (current.children && current.children.length > 0) {
        current = current.children[0]
        depth++
      }
      expect(depth).toBe(100)
    })

    it('should handle nodes with same id but different parents', () => {
      const duplicateIdList = [
        { id: 1, name: 'Root', pid: 0 },
        { id: 2, name: 'Child 1', pid: 1 },
        { id: 2, name: 'Child 2', pid: 1 } // Duplicate id
      ]

      const result = listToTree(duplicateIdList)
      // The second node with id 2 should overwrite the first in the map
      expect(result[0].children).toHaveLength(1)
      expect(result[0].children[0].name).toBe('Child 2')
    })
  })
})
