import { defineStore } from 'pinia'

export const usePosts = defineStore('posts', () => {
  const { $api } = useNuxtApp()
  
  const posts = ref([])
  
  async function fetchPosts() {
    try {
      const response = await $api.get('posts')
      posts.value = response.data
      return response.data
    } catch (error) {
      console.error('Error fetching posts:', error)
      return []
    }
  }
  
  async function createPost(postData) {
    try {
      const response = await $api.post('posts', postData)
      // Add the new post to the beginning of the posts array
      posts.value.unshift(response.data)
      return response.data
    } catch (error) {
      console.error('Error creating post:', error)
      throw error
    }
  }
  
  return {
    posts,
    fetchPosts,
    createPost
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePosts, import.meta.hot))
}
