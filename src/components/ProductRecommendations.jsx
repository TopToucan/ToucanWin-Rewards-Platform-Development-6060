import React, { useState, useEffect } from 'react';
import { Box, Container, Heading, Text, SimpleGrid, Badge, HStack, VStack, Button, useColorModeValue, Flex } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import LazyImage from './LazyImage';
import { ProductController } from '../controllers/ProductController';

const { FiStar, FiTrendingUp, FiShoppingCart, FiHeart } = FiIcons;

const MotionBox = motion(Box);

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const cardBg = useColorModeValue('white', 'gray.700');

  return (
    <MotionBox
      position="relative"
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      bg={cardBg}
      rounded="lg"
      shadow="md"
      overflow="hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box position="relative" h="240px" overflow="hidden">
        <LazyImage
          src={product.image}
          alt={product.name}
          width={400}
          height={240}
          sizes={[400, 600, 800]}
          breakpoints={{ sm: '400px', md: '600px', lg: '800px' }}
          fallbackSrc="https://via.placeholder.com/400x240/38B2AC/FFFFFF?text=Product"
          w="full"
          h="full"
          objectFit="cover"
          transition="transform 0.5s"
          transform={isHovered ? "scale(1.05)" : "scale(1)"}
          loading="lazy"
        />
        
        {/* Favorite Button */}
        <Button
          position="absolute"
          top={2}
          right={2}
          size="sm"
          borderRadius="full"
          bg={isFavorite ? "red.500" : "whiteAlpha.800"}
          color={isFavorite ? "white" : "gray.700"}
          width="36px"
          height="36px"
          minW="36px"
          p={0}
          _hover={{ transform: "scale(1.1)" }}
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
        >
          <SafeIcon icon={FiHeart} className={isFavorite ? "fill-current" : ""} />
        </Button>

        <Badge
          position="absolute"
          top={2}
          left={2}
          colorScheme={product.popularity === "Hot" ? "red" : product.popularity === "Trending" ? "purple" : "green"}
          px={2}
          py={1}
          borderRadius="full"
        >
          <HStack spacing={1}>
            <SafeIcon icon={FiTrendingUp} />
            <Text>{product.popularity}</Text>
          </HStack>
        </Badge>
      </Box>

      <Box p={4}>
        <VStack align="start" spacing={2}>
          <HStack>
            <SafeIcon icon={FiStar} className="text-yellow-400" />
            <Text fontSize="sm" fontWeight="bold">{product.rating}</Text>
          </HStack>
          
          <Heading size="md" noOfLines={2}>
            {product.name}
          </Heading>
          
          <Text color="gray.600" fontSize="sm">
            {product.category}
          </Text>
          
          <HStack justify="space-between" w="full">
            <Text color="teal.600" fontWeight="bold">
              {product.points} points
            </Text>
            <Button
              size="sm"
              colorScheme="teal"
              leftIcon={<SafeIcon icon={FiShoppingCart} />}
              variant="outline"
              _hover={{ bg: 'teal.500', color: 'white' }}
            >
              Redeem
            </Button>
          </HStack>
        </VStack>
      </Box>

      {/* Quick View Overlay on Hover */}
      <MotionBox
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        bg="blackAlpha.700"
        color="white"
        textAlign="center"
        py={3}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
        transition={{ duration: 0.2 }}
      >
        Quick View
      </MotionBox>
    </MotionBox>
  );
};

const ProductRecommendations = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const recommendedProducts = ProductController.getRecommendedProducts();
    // Add more products for visual appeal
    const extendedProducts = [
      ...recommendedProducts,
      {
        id: 4,
        name: "Bluetooth Speaker",
        points: 1200,
        category: "Audio",
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=400",
        popularity: "Trending"
      },
      {
        id: 5,
        name: "Yoga Mat Premium",
        points: 950,
        category: "Fitness",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400",
        popularity: "Hot"
      },
      {
        id: 6,
        name: "Portable Phone Charger",
        points: 700,
        category: "Accessories",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?auto=format&fit=crop&q=80&w=400",
        popularity: "New"
      }
    ];
    setProducts(extendedProducts);
  }, []);

  return (
    <Box>
      {/* Hero Section */}
      <Box bgGradient="linear(to-r,purple.600,purple.400)" color="white" py={10} mb={10}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} alignItems="center">
            <VStack align="start" spacing={4}>
              <Heading size="xl">Recommended For You</Heading>
              <Text fontSize="lg" opacity={0.9}>
                Discover products tailored to your preferences and redeem with your points.
              </Text>
            </VStack>
            <Flex justify={{ base: "center", md: "flex-end" }}>
              <MotionBox
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                <SafeIcon icon={FiShoppingCart} className="text-8xl text-white opacity-90" />
              </MotionBox>
            </Flex>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Products Grid */}
      <Container maxW="container.xl" pb={16}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default ProductRecommendations;