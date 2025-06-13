// Création d'une image placeholder pour les images manquantes
function createPlaceholderImage() {
  const canvas = document.createElement("canvas")
  canvas.width = 300
  canvas.height = 200
  const ctx = canvas.getContext("2d")

  // Fond gris foncé
  ctx.fillStyle = "#333"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Texte
  ctx.fillStyle = "#00ffff"
  ctx.font = "20px Arial"
  ctx.textAlign = "center"
  ctx.fillText("Image non disponible", canvas.width / 2, canvas.height / 2)

  // Bordure
  ctx.strokeStyle = "#00ffff"
  ctx.lineWidth = 3
  ctx.strokeRect(3, 3, canvas.width - 6, canvas.height - 6)

  // Convertir en data URL
  const dataURL = canvas.toDataURL()

  // Créer une image réelle
  const img = new Image()
  img.src = dataURL

  // Sauvegarder l'image
  const link = document.createElement("a")
  link.download = "placeholder.jpg"
  link.href = dataURL
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Décommenter pour générer l'image placeholder
// createPlaceholderImage();
