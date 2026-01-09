import { defineStore } from 'pinia'

export const useFavorites = defineStore('favorites', () => {
  const { $api } = useNuxtApp()
  
  // Store favorite users
  const favoriteUsers = ref([])
  
  // Check if a user is in favorites
  const isUserFavorite = (userId) => {
    return favoriteUsers.value.includes(userId)
  }
  
  // Fetch favorite users from API
  async function fetchFavoriteUsers() {
    try {
      const response = await $api.get('favorites')
      favoriteUsers.value = response.data.users.map(user => user.id)
      return response.data
    } catch (error) {
      console.error('Error fetching favorite users:', error)
      return []
    }
  }
  
  // Add user to favorites
  async function addUserToFavorites(userId) {
    try {
      await $api.post(`users/${userId}/favorite`)
      favoriteUsers.value.push(userId)
    } catch (error) {
      console.error('Error adding user to favorites:', error)
      throw error
    }
  }
  
  // Remove user from favorites
  async function removeUserFromFavorites(userId) {
    try {
      await $api.delete(`users/${userId}/favorite`)
      const index = favoriteUsers.value.indexOf(userId)
      if (index !== -1) {
        favoriteUsers.value.splice(index, 1)
      }
    } catch (error) {
      console.error('Error removing user from favorites:', error)
      throw error
    }
  }
  
  // Toggle user favorite status
  async function toggleUserFavorite(userId) {
    if (isUserFavorite(userId)) {
      await removeUserFromFavorites(userId)
      return false
    } else {
      await addUserToFavorites(userId)
      return true
    }
  }
  
  return {
    favoriteUsers,
    isUserFavorite,
    fetchFavoriteUsers,
    addUserToFavorites,
    removeUserFromFavorites,
    toggleUserFavorite
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFavorites, import.meta.hot))
}
