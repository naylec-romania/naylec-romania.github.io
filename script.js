// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      // Cas spécial pour l'accueil - aller vraiment en haut
      if (this.getAttribute("href") === "#accueil") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      } else {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }
  })
})

// Active navigation link - Version corrigée
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]")
  const navLinks = document.querySelectorAll(".nav-link")

  let current = ""
  const scrollPosition = window.scrollY

  // Si on est tout en haut (moins de 100px), activer l'accueil
  if (scrollPosition < 100) {
    current = "accueil"
  } else {
    // Pour les autres sections, utiliser la détection normale
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 200 // Offset pour la navbar
      const sectionHeight = section.clientHeight
      const sectionBottom = sectionTop + sectionHeight

      // Vérifier si on est dans cette section
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        current = section.getAttribute("id")
      }
    })

    // Cas spécial pour la dernière section (À propos)
    const lastSection = sections[sections.length - 1]
    const documentHeight = document.documentElement.scrollHeight
    const windowHeight = window.innerHeight

    // Si on est proche du bas de la page, activer la dernière section
    if (scrollPosition + windowHeight >= documentHeight - 50) {
      current = lastSection.getAttribute("id")
    }
  }

  // Mettre à jour les liens de navigation
  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active")
    }
  })
})

// Gallery lightbox effect for timeline photos
document.querySelectorAll(".timeline-photo").forEach((photo) => {
  photo.addEventListener("click", function () {
    const lightbox = document.createElement("div")
    lightbox.className = "lightbox"
    lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${this.src}" alt="${this.alt}">
                <span class="lightbox-close">&times;</span>
            </div>
        `

    document.body.appendChild(lightbox)
    document.body.style.overflow = "hidden"

    // Close lightbox
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.className === "lightbox-close") {
        document.body.removeChild(lightbox)
        document.body.style.overflow = "auto"
      }
    })

    // Close with Escape key
    document.addEventListener("keydown", function escapeHandler(e) {
      if (e.key === "Escape") {
        if (document.body.contains(lightbox)) {
          document.body.removeChild(lightbox)
          document.body.style.overflow = "auto"
        }
        document.removeEventListener("keydown", escapeHandler)
      }
    })
  })
})

// Video Player Functionality - Version simplifiée
document.addEventListener("DOMContentLoaded", () => {
  const videoWrapper = document.getElementById("video-wrapper")
  const videoPlaylist = document.getElementById("video-playlist")
  const currentVideoTitle = document.getElementById("current-video-title")
  const videoUpload = document.getElementById("video-upload")

  let currentVideoSrc = ""

  // Initialize with first video
  const firstVideo = videoPlaylist ? videoPlaylist.querySelector(".playlist-item") : null
  if (firstVideo) {
    loadVideo(firstVideo.dataset.src, firstVideo.querySelector("h4").textContent)
    firstVideo.classList.add("active")
  }

  // Handle playlist item clicks
  document.querySelectorAll(".playlist-item").forEach((item) => {
    item.addEventListener("click", function () {
      const videoSrc = this.dataset.src
      const videoTitle = this.querySelector("h4").textContent

      // Update active state
      document.querySelectorAll(".playlist-item").forEach((item) => item.classList.remove("active"))
      this.classList.add("active")

      // Load the video
      loadVideo(videoSrc, videoTitle)
    })
  })

  // Handle file upload
  if (videoUpload) {
    videoUpload.addEventListener("change", function (e) {
      if (this.files && this.files[0]) {
        const file = this.files[0]
        const videoURL = URL.createObjectURL(file)
        const fileName = file.name.replace(/\.[^/.]+$/, "") // Remove extension

        // Create new playlist item
        const newItem = document.createElement("div")
        newItem.className = "playlist-item"
        newItem.dataset.src = videoURL
        newItem.innerHTML = `
                  <div class="playlist-item-thumbnail">
                      <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&h=80&fit=crop" alt="Video thumbnail">
                      <div class="play-icon">▶</div>
                  </div>
                  <div class="playlist-item-info">
                      <h4>${fileName}</h4>
                      <p>Vidéo ajoutée</p>
                  </div>
              `

        // Add click event
        newItem.addEventListener("click", function () {
          document.querySelectorAll(".playlist-item").forEach((item) => item.classList.remove("active"))
          this.classList.add("active")
          loadVideo(videoURL, fileName)
        })

        // Add to playlist and select it
        if (videoPlaylist) {
          videoPlaylist.appendChild(newItem)
          newItem.click()
        }
      }
    })
  }

  // Function to load video
  function loadVideo(src, title) {
    if (!videoWrapper || !currentVideoTitle) return

    // Update current video info
    currentVideoSrc = src
    currentVideoTitle.textContent = title || "Vidéo"

    // Clear video wrapper
    videoWrapper.innerHTML = ""

    // Create video element
    const video = document.createElement("video")
    video.src = src
    video.controls = true
    video.autoplay = false // Changé pour éviter l'erreur d'autoplay
    video.className = "video-player-element"
    video.style.width = "100%"
    video.style.height = "100%"

    // Handle video load error
    video.addEventListener("error", () => {
      videoWrapper.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #1a1a1a; color: #ffffff; text-align: center; padding: 20px;">
          <div>
            <h3>Vidéo non trouvée</h3>
            <p>Le fichier "${src}" n'existe pas encore.</p>
            <p style="margin-top: 10px; font-size: 0.9rem; opacity: 0.7;">Ajoutez vos propres vidéos via le bouton "Ajouter une vidéo"</p>
          </div>
        </div>
      `
    })

    videoWrapper.appendChild(video)
  }

  // Keyboard shortcuts for video navigation
  document.addEventListener("keydown", (e) => {
    // Only if we're in the video section
    if (window.location.hash === "#videos") {
      if (e.key === "ArrowRight") {
        // Next video
        const activeItem = videoPlaylist ? videoPlaylist.querySelector(".playlist-item.active") : null
        if (
          activeItem &&
          activeItem.nextElementSibling &&
          activeItem.nextElementSibling.classList.contains("playlist-item")
        ) {
          activeItem.nextElementSibling.click()
        }
      } else if (e.key === "ArrowLeft") {
        // Previous video
        const activeItem = videoPlaylist ? videoPlaylist.querySelector(".playlist-item.active") : null
        if (
          activeItem &&
          activeItem.previousElementSibling &&
          activeItem.previousElementSibling.classList.contains("playlist-item")
        ) {
          activeItem.previousElementSibling.click()
        }
      }
    }
  })
})

// Parallax effect for hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const parallax = document.querySelector(".hero")
  if (parallax) {
    const speed = scrolled * 0.5
    parallax.style.transform = `translateY(${speed}px)`
  }
})

// Typing effect for hero title - Version simplifiée
window.addEventListener("load", () => {
  const heroTitle = document.querySelector(".hero-title")
  if (heroTitle) {
    // Version plus simple : on désactive l'effet de frappe pour éviter les problèmes HTML
    // typeWriter(heroTitle, 50)

    // Alternative : effet de fade-in simple
    heroTitle.style.opacity = "0"
    heroTitle.style.transform = "translateY(20px)"
    heroTitle.style.transition = "opacity 1s ease, transform 1s ease"

    setTimeout(() => {
      heroTitle.style.opacity = "1"
      heroTitle.style.transform = "translateY(0)"
    }, 500)
  }
})

// Add glow effect on hover for interactive elements
document.querySelectorAll(".timeline-content, .gallery-item").forEach((item) => {
  item.addEventListener("mouseenter", function () {
    this.style.boxShadow = "0 0 30px rgba(0, 255, 255, 0.3)"
  })

  item.addEventListener("mouseleave", function () {
    this.style.boxShadow = ""
  })
})

// Add lightbox styles dynamically
const lightboxStyles = `
    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }
    
    .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
    }
    
    .lightbox img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 8px;
    }
    
    .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 30px;
        cursor: pointer;
        font-weight: bold;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`

const styleSheet = document.createElement("style")
styleSheet.textContent = lightboxStyles
document.head.appendChild(styleSheet)

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateX(0)"
    }
  })
}, observerOptions)

// Observe timeline items
document.querySelectorAll(".timeline-item").forEach((item, index) => {
  item.style.opacity = "0"
  item.style.transform = "translateX(-50px)"
  item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`
  observer.observe(item)
})

// Observe gallery photos
document.querySelectorAll(".gallery-photo").forEach((photo, index) => {
  photo.style.opacity = "0"
  photo.style.transform = "translateY(30px)"
  photo.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`
  observer.observe(photo)
})

// ===== GALERIE AMÉLIORÉE POUR 108 IMAGES =====

// Configuration des jours et des images par jour
const dayConfig = [
  { day: 1, count: 8, date: "02.06.2025", location: "Iaşi", category: "iasi" },
  { day: 2, count: 8, date: "03.06.2025", location: "Târgu Neamț", category: "targu-neamt" },
  { day: 3, count: 30, date: "04.06.2025", location: "Iaşi", category: "iasi" },
  { day: 4, count: 7, date: "05.06.2025", location: "Târgu Neamț", category: "targu-neamt" },
  { day: 5, count: 25, date: "06.06.2025", location: "Brașov", category: "brasov" },
  { day: 6, count: 30, date: "07.06.2025", location: "Bucarest", category: "bucarest" },
]

// Génération des données pour toutes les images
const galleryData = []

// Créer les données pour chaque jour
dayConfig.forEach((config) => {
  for (let i = 1; i <= config.count; i++) {
    galleryData.push({
      id: galleryData.length + 1,
      src: `img ${config.day}-${i}.jpg`,
      title: `Jour ${config.day} - Photo ${i}`,
      category: config.category,
      location: config.location,
      date: config.date,
      day: config.day,
    })
  }
})

// Configuration de la galerie
const galleryConfig = {
  itemsPerPage: 12,
  currentPage: 1,
  currentFilter: "all",
  searchTerm: "",
  totalPages: Math.ceil(galleryData.length / 12),
}

// Variables pour le lightbox
let currentImageIndex = 0
let filteredGallery = [...galleryData]

// Initialiser la galerie quand le DOM est prêt
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM chargé, initialisation de la galerie...")

  // Éléments DOM pour la galerie
  const galleryGrid = document.getElementById("gallery-grid")
  const filterButtons = document.querySelectorAll(".filter-btn")
  const searchInput = document.getElementById("gallery-search")
  const loadMoreBtn = document.getElementById("load-more")
  const paginationNumbers = document.getElementById("pagination-numbers")
  const galleryLightbox = document.getElementById("gallery-lightbox")
  const lightboxImage = document.getElementById("lightbox-image")
  const lightboxCaption = document.getElementById("lightbox-caption")
  const lightboxPrev = document.getElementById("lightbox-prev")
  const lightboxNext = document.getElementById("lightbox-next")
  const lightboxClose = document.getElementById("lightbox-close")

  console.log("Éléments DOM récupérés:", {
    galleryGrid: !!galleryGrid,
    filterButtons: filterButtons.length,
    searchInput: !!searchInput,
    loadMoreBtn: !!loadMoreBtn,
    paginationNumbers: !!paginationNumbers,
    galleryLightbox: !!galleryLightbox,
    lightboxImage: !!lightboxImage,
    lightboxCaption: !!lightboxCaption,
    lightboxPrev: !!lightboxPrev,
    lightboxNext: !!lightboxNext,
    lightboxClose: !!lightboxClose,
  })

  // Vérifier que les éléments existent avant de continuer
  if (!galleryGrid) {
    console.error("Galerie non trouvée, initialisation annulée")
    return
  }

  // Créer une image placeholder si nécessaire
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

    return canvas.toDataURL()
  }

  // Image placeholder
  const placeholderImage = createPlaceholderImage()

  // Fonction pour filtrer les images
  function filterGallery() {
    console.log("Filtrage de la galerie avec:", {
      filter: galleryConfig.currentFilter,
      search: galleryConfig.searchTerm,
    })

    // Filtrer par catégorie
    if (galleryConfig.currentFilter === "all") {
      filteredGallery = [...galleryData]
    } else {
      filteredGallery = galleryData.filter((item) => item.category === galleryConfig.currentFilter)
    }

    // Filtrer par recherche
    if (galleryConfig.searchTerm) {
      const term = galleryConfig.searchTerm.toLowerCase()
      filteredGallery = filteredGallery.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.location.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term) ||
          `jour ${item.day}`.includes(term),
      )
    }

    console.log(`Filtrage terminé: ${filteredGallery.length} images trouvées`)

    // Mettre à jour le compteur
    updateCounter()

    // Mettre à jour la pagination
    galleryConfig.totalPages = Math.ceil(filteredGallery.length / galleryConfig.itemsPerPage)
    galleryConfig.currentPage = 1

    // Afficher les images
    renderGallery()
    renderPagination()
  }

  // Fonction pour afficher les images
  function renderGallery() {
    if (!galleryGrid) return

    console.log(`Rendu de la galerie: page ${galleryConfig.currentPage}/${galleryConfig.totalPages}`)

    // Vider la grille
    galleryGrid.innerHTML = ""

    // Calculer les indices de début et de fin
    const startIndex = (galleryConfig.currentPage - 1) * galleryConfig.itemsPerPage
    const endIndex = Math.min(startIndex + galleryConfig.itemsPerPage, filteredGallery.length)

    // Afficher un message si aucune image ne correspond
    if (filteredGallery.length === 0) {
      galleryGrid.innerHTML = `
        <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 50px 0;">
          <p>Aucune image ne correspond à votre recherche.</p>
        </div>
      `
      return
    }

    // Afficher les images
    for (let i = startIndex; i < endIndex; i++) {
      const item = filteredGallery[i]
      const galleryItem = document.createElement("div")
      galleryItem.className = "gallery-item"
      galleryItem.dataset.id = item.id
      galleryItem.dataset.index = i

      galleryItem.innerHTML = `
  <img src="${item.src}" alt="${item.title}" class="gallery-photo" loading="lazy" 
       onerror="console.log('Erreur de chargement pour:', '${item.src}'); this.src='${placeholderImage}'; this.classList.add('image-error');"
       onload="console.log('Image chargée avec succès:', '${item.src}');">
  <div class="gallery-overlay">
    <span class="gallery-title">${item.title}</span>
    <span class="gallery-location">${item.location}</span>
    <span class="gallery-date">${item.date}</span>
  </div>
`

      // Ajouter l'événement de clic pour ouvrir le lightbox
      galleryItem.addEventListener("click", () => {
        openLightbox(i)
      })

      galleryGrid.appendChild(galleryItem)
    }

    // Observer les nouvelles images pour l'animation
    document.querySelectorAll(".gallery-item").forEach((item, index) => {
      item.style.opacity = "0"
      item.style.transform = "translateY(30px)"
      item.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`
      observer.observe(item)
    })

    // Afficher ou masquer le bouton "Charger plus"
    if (loadMoreBtn) {
      if (endIndex >= filteredGallery.length) {
        loadMoreBtn.style.display = "none"
      } else {
        loadMoreBtn.style.display = "block"
      }
    }
  }

  // Fonction pour mettre à jour le compteur d'images
  function updateCounter() {
    const countElement = document.querySelector(".count-number")
    const totalElement = document.querySelector(".total-number")

    if (countElement && totalElement) {
      countElement.textContent = filteredGallery.length
      totalElement.textContent = galleryData.length
    }
  }

  // Fonction pour afficher la pagination
  function renderPagination() {
    if (!paginationNumbers) return

    paginationNumbers.innerHTML = ""

    // Ne pas afficher la pagination s'il n'y a qu'une seule page
    if (galleryConfig.totalPages <= 1) {
      return
    }

    // Limiter le nombre de pages affichées
    const maxVisiblePages = 5
    let startPage = Math.max(1, galleryConfig.currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(galleryConfig.totalPages, startPage + maxVisiblePages - 1)

    // Ajuster si on est proche de la fin
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Ajouter le bouton "Première page" si nécessaire
    if (startPage > 1) {
      const firstPage = document.createElement("div")
      firstPage.className = "page-number"
      firstPage.textContent = "1"
      firstPage.addEventListener("click", () => goToPage(1))
      paginationNumbers.appendChild(firstPage)

      if (startPage > 2) {
        const ellipsis = document.createElement("div")
        ellipsis.className = "page-ellipsis"
        ellipsis.textContent = "..."
        paginationNumbers.appendChild(ellipsis)
      }
    }

    // Ajouter les numéros de page
    for (let i = startPage; i <= endPage; i++) {
      const pageNumber = document.createElement("div")
      pageNumber.className = "page-number"
      if (i === galleryConfig.currentPage) {
        pageNumber.classList.add("active")
      }
      pageNumber.textContent = i
      pageNumber.addEventListener("click", () => goToPage(i))
      paginationNumbers.appendChild(pageNumber)
    }

    // Ajouter le bouton "Dernière page" si nécessaire
    if (endPage < galleryConfig.totalPages) {
      if (endPage < galleryConfig.totalPages - 1) {
        const ellipsis = document.createElement("div")
        ellipsis.className = "page-ellipsis"
        ellipsis.textContent = "..."
        paginationNumbers.appendChild(ellipsis)
      }

      const lastPage = document.createElement("div")
      lastPage.className = "page-number"
      lastPage.textContent = galleryConfig.totalPages
      lastPage.addEventListener("click", () => goToPage(galleryConfig.totalPages))
      paginationNumbers.appendChild(lastPage)
    }
  }

  // Fonction pour changer de page
  function goToPage(page) {
    galleryConfig.currentPage = page
    renderGallery()
    renderPagination()

    // Faire défiler vers le haut de la galerie
    const galerieSection = document.getElementById("galerie")
    if (galerieSection) {
      galerieSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Fonction pour charger plus d'images
  function loadMoreImages() {
    galleryConfig.currentPage++
    renderGallery()
    renderPagination()
  }

  // Fonction pour ouvrir le lightbox
  function openLightbox(index) {
    console.log("Ouverture du lightbox pour l'image", index)

    if (!lightboxImage || !lightboxCaption || !galleryLightbox) {
      console.error("Éléments du lightbox manquants:", {
        lightboxImage: !!lightboxImage,
        lightboxCaption: !!lightboxCaption,
        galleryLightbox: !!galleryLightbox,
      })
      return
    }

    currentImageIndex = index
    const item = filteredGallery[index]

    lightboxImage.src = item.src
    lightboxImage.onerror = function () {
      this.src = placeholderImage
      this.classList.add("image-error")
    }

    lightboxCaption.textContent = `${item.title} - ${item.location} (${item.date})`

    galleryLightbox.classList.add("active")
    document.body.style.overflow = "hidden"

    // Mettre à jour les boutons de navigation
    updateLightboxNavigation()
  }

  // Fonction pour fermer le lightbox
  function closeLightbox() {
    if (!galleryLightbox) return

    galleryLightbox.classList.remove("active")
    document.body.style.overflow = "auto"
  }

  // Fonction pour naviguer dans le lightbox
  function navigateLightbox(direction) {
    if (!lightboxImage || !lightboxCaption) return

    currentImageIndex += direction

    // Vérifier les limites
    if (currentImageIndex < 0) {
      currentImageIndex = filteredGallery.length - 1
    } else if (currentImageIndex >= filteredGallery.length) {
      currentImageIndex = 0
    }

    const item = filteredGallery[currentImageIndex]
    lightboxImage.src = item.src
    lightboxImage.onerror = function () {
      this.src = placeholderImage
      this.classList.add("image-error")
    }

    lightboxCaption.textContent = `${item.title} - ${item.location} (${item.date})`

    // Mettre à jour les boutons de navigation
    updateLightboxNavigation()
  }

  // Fonction pour mettre à jour les boutons de navigation du lightbox
  function updateLightboxNavigation() {
    // Pas besoin de désactiver les boutons car on fait une navigation circulaire
  }

  // Événements pour les filtres
  if (filterButtons) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        console.log("Filtre cliqué:", button.dataset.filter)

        // Mettre à jour l'état actif
        filterButtons.forEach((btn) => btn.classList.remove("active"))
        button.classList.add("active")

        // Mettre à jour le filtre
        galleryConfig.currentFilter = button.dataset.filter

        // Filtrer la galerie
        filterGallery()
      })
    })
  }

  // Événement pour la recherche
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      galleryConfig.searchTerm = searchInput.value.trim()
      filterGallery()
    })
  }

  // Événement pour charger plus d'images
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", loadMoreImages)
  }

  // Événements pour le lightbox
  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox)
  }
  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", () => navigateLightbox(-1))
  }
  if (lightboxNext) {
    lightboxNext.addEventListener("click", () => navigateLightbox(1))
  }

  // Fermer le lightbox avec la touche Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && galleryLightbox && galleryLightbox.classList.contains("active")) {
      closeLightbox()
    } else if (e.key === "ArrowLeft" && galleryLightbox && galleryLightbox.classList.contains("active")) {
      navigateLightbox(-1)
    } else if (e.key === "ArrowRight" && galleryLightbox && galleryLightbox.classList.contains("active")) {
      navigateLightbox(1)
    }
  })

  // Initialiser la galerie
  console.log("Initialisation de la galerie...")
  filterGallery()
})
