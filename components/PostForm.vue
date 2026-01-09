<script setup>
import { usePosts } from '~/stores/posts'
import { ref } from 'vue'

const postStore = usePosts()
const title = ref('')
const body = ref('')
const image = ref(null)
const imagePreview = ref('')
const isSubmitting = ref(false)
const { showErrorModal } = useHelpers()

function handleImageChange(event) {
  const file = event.target.files[0]
  if (!file) {
    image.value = null
    imagePreview.value = ''
    return
  }
  
  // Check if the file is an image
  if (!file.type.startsWith('image/')) {
    showErrorModal(null, 'Please select an image file')
    event.target.value = null
    return
  }
  
  // Store the file for upload
  image.value = file
  
  // Create a preview URL
  imagePreview.value = URL.createObjectURL(file)
}

function removeImage() {
  image.value = null
  imagePreview.value = ''
  // Reset the file input
  const fileInput = document.getElementById('image-upload')
  if (fileInput) fileInput.value = ''
}

async function submit() {
  if (!title.value || !body.value) return

  try {
    isSubmitting.value = true
    
    if (image.value) {
      // Create post with image
      await postStore.createPostWithImage(title.value, body.value, image.value)
    } else {
      // Create post without image
      await postStore.createPost({ title: title.value, body: body.value })
    }
    
    // Clear the form after successful submission
    title.value = ''
    body.value = ''
    removeImage()
  } catch (error) {
    showErrorModal(error, 'Failed to create post. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form
    class="grid gap-4 mb-16"
    @submit.prevent="submit">
    <input
      v-model="title"
      placeholder="Post title"
      class="block w-full rounded-lg border border-gray-400 px-5 py-4 text-sm focus:border-blue-500 focus:outline-none md:text-base">
    <textarea
      v-model="body"
      placeholder="What is happening?!"
      class="block w-full rounded-lg border border-gray-400 px-5 py-4 text-sm focus:border-blue-500 focus:outline-none md:text-base"></textarea>
    
    <!-- Image upload section -->
    <div class="border border-gray-400 rounded-lg p-4">
      <div class="flex items-center justify-between mb-2">
        <label for="image-upload" class="font-medium text-blue-600 cursor-pointer">
          Add an image
        </label>
        <button 
          v-if="imagePreview" 
          type="button" 
          class="text-red-500 text-sm"
          @click="removeImage">
          Remove
        </button>
      </div>
      
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleImageChange">
      
      <!-- Image preview -->
      <div v-if="imagePreview" class="mt-2">
        <img :src="imagePreview" class="max-h-40 rounded-lg" alt="Image preview">
      </div>
    </div>
    
    <button 
      class="bg-blue-600 text-white px-8 py-4 rounded-lg"
      :disabled="isSubmitting">
      {{ isSubmitting ? 'Posting...' : 'Post' }}
    </button>
  </form>
</template>
