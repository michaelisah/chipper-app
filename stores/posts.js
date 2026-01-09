import { defineStore } from 'pinia'

export const usePosts = defineStore('posts', () => {
  const { $api } = useNuxtApp()
  
  const posts = ref([])
  const newPosts = ref([])
  const hasNewPosts = ref(false)
  const lastFetchedId = ref(null)
  const isPolling = ref(false)
  
  async function fetchPosts() {
    try {
      const response = await $api.get('posts')
      posts.value = response.data
      
      // Update the last fetched post ID if there are posts
      if (response.data.length > 0) {
        lastFetchedId.value = response.data[0].id
      }
      
      return response.data
    } catch (error) {
      console.error('Error fetching posts:', error)
      return []
    }
  }
  
  async function checkForNewPosts() {
    if (!lastFetchedId.value) return
    
    try {
      isPolling.value = true
      // Use the regular posts endpoint and filter new posts client-side
      const response = await $api.get('posts')
      
      if (response.data && response.data.length > 0) {
        // Filter posts that are newer than our last fetched post
        const newerPosts = response.data.filter(post => post.id > lastFetchedId.value)
        
        if (newerPosts.length > 0) {
          newPosts.value = newerPosts
          hasNewPosts.value = true
        }
      }
      
      return newPosts.value
    } catch (error) {
      console.error('Error checking for new posts:', error)
      return []
    } finally {
      isPolling.value = false
    }
  }
  
  function loadNewPosts() {
    if (newPosts.value.length > 0) {
      // Combine all posts and sort them by ID in descending order
      const allPosts = [...newPosts.value, ...posts.value]
      posts.value = allPosts.sort((a, b) => b.id - a.id)
      
      // Update the last fetched post ID
      lastFetchedId.value = posts.value[0].id
      
      // Reset new posts
      newPosts.value = []
      hasNewPosts.value = false
    }
  }
  
  async function createPost(postData) {
    try {
      const response = await $api.post('posts', postData)
      // Add the new post to the beginning of the posts array
      posts.value.unshift(response.data)
      
      // Update the last fetched post ID
      lastFetchedId.value = response.data.id
      
      return response.data
    } catch (error) {
      console.error('Error creating post:', error)
      throw error
    }
  }
  
  async function createPostWithImage(title, body, imageFile) {
    try {
      // Create a FormData object to send the post data and image
      const formData = new FormData()
      formData.append('title', title)
      formData.append('body', body)
      formData.append('image', imageFile)
      
      // Use the postFormData method to send the form data
      const response = await $api.postFormData('posts', formData)
      
      // Add the new post to the beginning of the posts array
      posts.value.unshift(response.data)
      
      // Update the last fetched post ID
      lastFetchedId.value = response.data.id
      
      return response.data
    } catch (error) {
      console.error('Error creating post with image:', error)
      throw error
    }
  }
  
  return {
    posts,
    newPosts,
    hasNewPosts,
    isPolling,
    fetchPosts,
    checkForNewPosts,
    loadNewPosts,
    createPost,
    createPostWithImage
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePosts, import.meta.hot))
}
