const express = require('express');
const router = express.Router();

// Enhanced mock data with proper image URLs
const generateMockTailors = () => {
  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 
    'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 
    'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara'
  ];
  
  const specialties = [
    'Traditional Wear', 'Western Wear', 'Bridal Wear', 'Casual Wear',
    'Formal Wear', 'Kids Wear', 'Designer Wear', 'Emergency Services'
  ];
  
  const tiers = ['Basic', 'Intermediate', 'Expert'];
  const shopNames = [
    'Raj', 'Modern', 'Classic', 'Elite', 'Premium', 'Royal', 'Family',
    'City', 'Fashion', 'Trendy', 'Smart', 'Perfect', 'Master', 'Expert',
    'Creative', 'Designer', 'Luxury', 'Boutique', 'Style', 'New Look',
    'Gentleman', 'Lady', 'Kids', 'Bridal', 'Traditional', 'Western'
  ];
  
  const shopTypes = [
    'Tailors', 'Stitches', 'Fashion', 'Boutique', 'Designers', 'Studio',
    'House', 'Creations', 'Works', 'Shop', 'Center', 'Point'
  ];

  // Working image URLs from Unsplash
  const images = [
    'https://images.unsplash.com/photo-1594736797933-d0b64c9c56de?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1582142306909-195724d1a6ee?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1474176857210-7287e38cb6e0?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&h=300&fit=crop'
  ];

  const tailors = [];
  
  for (let i = 1; i <= 520; i++) {
    const tier = tiers[Math.floor(Math.random() * tiers.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const specialty = specialties[Math.floor(Math.random() * specialties.length)];
    const shopName = `${shopNames[Math.floor(Math.random() * shopNames.length)]} ${shopTypes[Math.floor(Math.random() * shopTypes.length)]}`;
    
    // Generate realistic data based on tier
    let rating, experience, priceRange;
    
    switch(tier) {
      case 'Basic':
        rating = (3.0 + Math.random() * 1.2).toFixed(1);
        experience = `${Math.floor(1 + Math.random() * 5)} years`;
        priceRange = `₹${150 + Math.floor(Math.random() * 150)} - ₹${300 + Math.floor(Math.random() * 200)}`;
        break;
      case 'Intermediate':
        rating = (3.8 + Math.random() * 1.0).toFixed(1);
        experience = `${Math.floor(5 + Math.random() * 10)} years`;
        priceRange = `₹${300 + Math.floor(Math.random() * 200)} - ₹${600 + Math.floor(Math.random() * 300)}`;
        break;
      case 'Expert':
        rating = (4.3 + Math.random() * 0.7).toFixed(1);
        experience = `${Math.floor(10 + Math.random() * 20)} years`;
        priceRange = `₹${600 + Math.floor(Math.random() * 400)} - ₹${1200 + Math.floor(Math.random() * 1000)}`;
        break;
    }
    
    // Add fabric specialties
    const fabricTypes = ['Cotton', 'Silk', 'Linen', 'Wool', 'Polyester', 'Chiffon', 'Georgette', 'Denim'];
    const randomFabricCount = Math.floor(Math.random() * 4) + 3;
    const fabricSpecialties = [];
    for (let j = 0; j < randomFabricCount; j++) {
      fabricSpecialties.push(fabricTypes[Math.floor(Math.random() * fabricTypes.length)]);
    }
    
    tailors.push({
      id: i,
      name: shopName,
      specialty: specialty,
      tier: tier,
      location: city,
      rating: parseFloat(rating),
      experience: experience,
      priceRange: priceRange,
      bio: `Experienced ${specialty.toLowerCase()} specialist with ${experience} of expertise in ${city}. Known for quality work and timely delivery.`,
      detailedBio: `With over ${experience} in the tailoring business, ${shopName} has built a reputation for precision and quality. Specializing in ${specialty.toLowerCase()} and has successfully completed ${Math.floor(Math.random() * 500) + 100}+ projects.`,
      fabricSpecialties: [...new Set(fabricSpecialties)],
      image: images[Math.floor(Math.random() * images.length)],
      owner: `Owner ${i}`,
      completedProjects: Math.floor(Math.random() * 500) + 100,
      responseTime: `${Math.floor(Math.random() * 12) + 4} hours`
    });
  }
  
  return tailors;
};

const mockTailors = generateMockTailors();

// GET all tailors with filtering, search and pagination
router.get('/', (req, res) => {
  let filteredTailors = [...mockTailors];
  
  // Apply filters if provided
  const { location, specialty, tier, rating, search, page = 1, limit = 12 } = req.query;
  
  if (location) {
    filteredTailors = filteredTailors.filter(tailor => 
      tailor.location.toLowerCase().includes(location.toLowerCase())
    );
  }
  
  if (specialty) {
    filteredTailors = filteredTailors.filter(tailor => 
      tailor.specialty.toLowerCase().includes(specialty.toLowerCase())
    );
  }
  
  if (tier) {
    filteredTailors = filteredTailors.filter(tailor => 
      tailor.tier.toLowerCase() === tier.toLowerCase()
    );
  }
  
  if (rating) {
    const minRating = parseFloat(rating);
    filteredTailors = filteredTailors.filter(tailor => 
      tailor.rating >= minRating
    );
  }
  
  if (search) {
    filteredTailors = filteredTailors.filter(tailor => 
      tailor.name.toLowerCase().includes(search.toLowerCase()) ||
      tailor.location.toLowerCase().includes(search.toLowerCase()) ||
      tailor.specialty.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Pagination
  const startIndex = (parseInt(page) - 1) * parseInt(limit);
  const endIndex = startIndex + parseInt(limit);
  const paginatedTailors = filteredTailors.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    count: filteredTailors.length,
    totalPages: Math.ceil(filteredTailors.length / parseInt(limit)),
    currentPage: parseInt(page),
    data: paginatedTailors
  });
});

// GET featured tailors
router.get('/featured', (req, res) => {
  const featuredTailors = [...mockTailors]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);
  
  res.json({
    success: true,
    data: featuredTailors
  });
});

// GET tailor by ID
router.get('/:id', (req, res) => {
  const tailor = mockTailors.find(t => t.id === parseInt(req.params.id));
  if (!tailor) {
    return res.status(404).json({
      success: false,
      message: 'Tailor not found'
    });
  }
  res.json({
    success: true,
    data: tailor
  });
});

// POST create new tailor
router.post('/', (req, res) => {
  const newTailor = {
    id: mockTailors.length + 1,
    ...req.body
  };
  mockTailors.push(newTailor);
  res.status(201).json({
    success: true,
    data: newTailor
  });
});

module.exports = router;