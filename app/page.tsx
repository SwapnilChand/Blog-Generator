'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCompletion } from 'ai/react'

export default function BlogPostGenerator() {
  const [links, setLinks] = useState<string[]>([])
  const [currentLink, setCurrentLink] = useState('')

  const { complete, completion, isLoading } = useCompletion({
    api: '/api/generate',
  })

  const addLink = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentLink) {
      setLinks([...links, currentLink])
      setCurrentLink('')
    }
  }

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index))
  }

  const generateBlogPost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (links.length > 0) {
      await complete(JSON.stringify({ links }))
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Blog Post Generator</CardTitle>
          <CardDescription>Enter URLs from X, YouTube, Medium, etc. to generate a blog post</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={addLink} className="space-y-4 mb-4">
            <div className="flex space-x-2">
              <Input
                type="url"
                placeholder="Enter URL here"
                value={currentLink}
                onChange={(e) => setCurrentLink(e.target.value)}
              />
              <Button type="submit">Add Link</Button>
            </div>
          </form>
          {links.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Added Links:</h3>
              <ul className="list-disc pl-5">
                {links.map((link, index) => (
                  <li key={index} className="flex justify-between items-center mb-2">
                    <span className="truncate flex-1 mr-2">{link}</span>
                    <Button variant="destructive" size="sm" onClick={() => removeLink(index)}>Remove</Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Button onClick={generateBlogPost} disabled={links.length === 0 || isLoading} className="w-full">
            {isLoading ? 'Generating...' : 'Generate Blog Post'}
          </Button>
        </CardContent>
        {completion && (
          <CardFooter>
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-2">Generated Blog Post:</h2>
              <div className="whitespace-pre-wrap prose max-w-none" dangerouslySetInnerHTML={{ __html: completion }} />
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}