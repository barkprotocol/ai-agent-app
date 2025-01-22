export async function uploadImage(file: File): Promise<string> {
  try {
    // Create form data
    const formData = new FormData()
    formData.append("file", file)

    // Upload to your preferred storage service
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload image")
    }

    const data = await response.json()
    return data.url
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

