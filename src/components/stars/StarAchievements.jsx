import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  HStack,
  Select,
  Badge,
  Progress,
  useColorModeValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import StarCard from './StarCard';
import { StarController } from '../../controllers/StarController';

const { FiStar, FiAward } = FiIcons;

const MotionBox = motion(Box);

const StarAchievements = ({ userId }) => {
  const [filter, setFilter] = useState('all');
  const allStars = StarController.getUserStars(userId);
  const earnedStars = StarController.getEarnedStars(userId);
  const unearnedStars = StarController.getUnearnedStars(userId);
  
  const categories = [
    { value: 'all', label: 'All Stars' },
    { value: 'earned', label: 'Earned' },
    { value: 'unearned', label: 'Locked' },
    { value: 'missions', label: 'Missions' },
    { value: 'receipts', label: 'Receipts' },
    { value: 'auctions', label: 'Auctions' },
    { value: 'campaigns', label: 'Campaigns' },
    { value: 'social', label: 'Social' },
    { value: 'loyalty', label: 'Loyalty' },
    { value: 'rewards', label: 'Rewards' },
    { value: 'special', label: 'Special' }
  ];
  
  // Filter stars based on selected filter
  const filteredStars = (() => {
    if (filter === 'all') return allStars;
    if (filter === 'earned') return earnedStars;
    if (filter === 'unearned') return unearnedStars;
    return allStars.filter(star => star.category === filter);
  })();
  
  // Calculate progress
  const totalStars = allStars.length;
  const earnedCount = earnedStars.length;
  const progressPercentage = Math.round((earnedCount / totalStars) * 100);
  
  // Calculate total points from stars
  const totalPossiblePoints = StarController.getTotalStarsValue();
  const totalEarnedPoints = StarController.getEarnedStarsValue(userId);
  
  return (
    <VStack spacing={8} align="stretch">
      <Heading size="lg" color="teal.600">Star Achievements</Heading>
      
      {/* Progress Summary */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        bg={useColorModeValue('white', 'gray.700')}
        p={6}
        borderRadius="xl"
        shadow="md"
      >
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <HStack>
              <SafeIcon icon={FiStar} className="text-2xl text-teal-500" />
              <Heading size="md">Your Star Collection</Heading>
            </HStack>
            <Badge 
              colorScheme="teal" 
              fontSize="md" 
              borderRadius="full" 
              px={3}
              py={1}
            >
              {earnedCount} / {totalStars}
            </Badge>
          </HStack>
          
          {/* Progress bar */}
          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
              {progressPercentage}% Complete
            </Text>
            <Progress 
              value={progressPercentage} 
              size="md" 
              colorScheme="teal" 
              borderRadius="full" 
              hasStripe
              isAnimated
            />
          </Box>
          
          {/* Points earned from stars */}
          <HStack justify="space-between" bg="teal.50" p={3} borderRadius="md">
            <HStack>
              <SafeIcon icon={FiAward} className="text-teal-500" />
              <Text fontWeight="medium">Points from Stars</Text>
            </HStack>
            <Text fontWeight="bold" color="teal.600">
              {totalEarnedPoints} / {totalPossiblePoints}
            </Text>
          </HStack>
        </VStack>
      </MotionBox>
      
      {/* Filters */}
      <HStack>
        <Text fontWeight="medium">Filter:</Text>
        <Select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          maxW="200px"
          size="sm"
        >
          {categories.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </Select>
        
        <Badge ml="auto" colorScheme="teal">
          {filteredStars.length} star{filteredStars.length !== 1 ? 's' : ''}
        </Badge>
      </HStack>
      
      {/* Stars Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {filteredStars.map((star, index) => (
          <StarCard 
            key={star.id} 
            star={star} 
          />
        ))}
      </SimpleGrid>
      
      {filteredStars.length === 0 && (
        <Box 
          textAlign="center" 
          py={10} 
          bg={useColorModeValue('gray.50', 'gray.700')}
          borderRadius="md"
        >
          <VStack spacing={3}>
            <SafeIcon icon={FiStar} className="text-4xl text-gray-400" />
            <Text color="gray.500">No stars found with the selected filter.</Text>
          </VStack>
        </Box>
      )}
    </VStack>
  );
};

export default StarAchievements;