import React, { useState } from 'react';
import { 
  Box, 
  SimpleGrid, 
  Heading, 
  Text, 
  Select, 
  HStack, 
  Badge,
  VStack,
  useColorModeValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import BadgeCard from './BadgeCard';
import { BadgeController } from '../../controllers/BadgeController';

const { FiAward } = FiIcons;
const MotionBox = motion(Box);

const BadgeGallery = ({ userId }) => {
  const [filter, setFilter] = useState('all');
  
  const allBadges = BadgeController.getUserBadges(userId);
  const earnedBadges = BadgeController.getEarnedBadges(userId);
  const unearnedBadges = BadgeController.getUnearnedBadges(userId);
  
  const categories = [
    { value: 'all', label: 'All Badges' },
    { value: 'earned', label: 'Earned' },
    { value: 'unearned', label: 'Locked' },
    { value: 'campaign', label: 'Campaign' },
    { value: 'auction', label: 'Auction' },
    { value: 'receipts', label: 'Receipts' },
    { value: 'social', label: 'Social' },
    { value: 'loyalty', label: 'Loyalty' },
    { value: 'level', label: 'Level' },
    { value: 'points', label: 'Points' },
    { value: 'special', label: 'Special' }
  ];
  
  // Filter badges based on selected filter
  const filteredBadges = (() => {
    if (filter === 'all') return allBadges;
    if (filter === 'earned') return earnedBadges;
    if (filter === 'unearned') return unearnedBadges;
    return allBadges.filter(badge => badge.category === filter);
  })();
  
  // Calculate progress
  const totalBadges = allBadges.length;
  const earnedCount = earnedBadges.length;
  const progressPercentage = Math.round((earnedCount / totalBadges) * 100);
  
  const bgColor = useColorModeValue('white', 'gray.700');
  
  return (
    <VStack spacing={8} align="stretch">
      <Heading size="lg" color="teal.600">Badge Collection</Heading>
      
      {/* Progress Summary */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        bg={bgColor}
        p={6}
        borderRadius="xl"
        shadow="md"
      >
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <HStack>
              <SafeIcon icon={FiAward} className="text-2xl text-teal-500" />
              <Heading size="md">Your Badges</Heading>
            </HStack>
            <Badge colorScheme="teal" fontSize="md" borderRadius="full" px={3} py={1}>
              {earnedCount} / {totalBadges}
            </Badge>
          </HStack>
          
          {/* Progress text */}
          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
              {progressPercentage}% Complete
            </Text>
            <Box bg="gray.100" h="8px" w="100%" borderRadius="full" overflow="hidden">
              <Box 
                bg="teal.500" 
                h="100%" 
                w={`${progressPercentage}%`} 
                borderRadius="full"
              />
            </Box>
          </Box>
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
          {filteredBadges.length} badge{filteredBadges.length !== 1 ? 's' : ''}
        </Badge>
      </HStack>
      
      {/* Badges Grid */}
      <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={6}>
        {filteredBadges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} size="lg" />
        ))}
      </SimpleGrid>
      
      {filteredBadges.length === 0 && (
        <Box textAlign="center" py={10} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
          <VStack spacing={3}>
            <SafeIcon icon={FiAward} className="text-4xl text-gray-400" />
            <Text color="gray.500">No badges found with the selected filter.</Text>
          </VStack>
        </Box>
      )}
    </VStack>
  );
};

export default BadgeGallery;