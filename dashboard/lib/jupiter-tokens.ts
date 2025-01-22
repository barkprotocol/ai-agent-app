import { cache } from "react"
import { z } from "zod"

// ... (previous code remains unchanged)

class TrieNode {
  children: { [key: string]: TrieNode } = {}
  isEndOfWord = false
  tokens: JupiterToken[] = []
}

class Trie {
  root: TrieNode = new TrieNode()

  insert(token: JupiterToken) {
    let node = this.root
    const key = (token.name + " " + token.symbol).toLowerCase()
    for (const char of key) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode()
      }
      node = node.children[char]
      node.tokens.push(token)
    }
    node.isEndOfWord = true
  }

  search(query: string): JupiterToken[] {
    let node = this.root
    for (const char of query.toLowerCase()) {
      if (!node.children[char]) {
        return []
      }
      node = node.children[char]
    }
    return node.tokens
  }
}

let tokenTrie: Trie | null = null

export const searchJupiterTokens = async (query: string): Promise<JupiterToken[]> => {
  const tokens = await getJupiterTokens()

  if (!tokenTrie) {
    tokenTrie = new Trie()
    tokens.forEach((token) => tokenTrie!.insert(token))
  }

  if (!query) return tokens

  const searchResults = tokenTrie.search(query.toLowerCase())
  const exactAddressMatch = tokens.find((token) => token.address.toLowerCase() === query.toLowerCase())

  return exactAddressMatch
    ? [exactAddressMatch, ...searchResults.filter((t) => t.address !== exactAddressMatch.address)]
    : searchResults
}

// ... (rest of the code remains unchanged)

