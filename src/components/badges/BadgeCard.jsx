import React from 'react';
import { Box, VStack, Text, Badge as ChakraBadge, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const BadgeCard = ({ badge, size = "md" }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Size values for the badge image
  const sizeValues = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };
  
  const imageSize = sizeValues[size] || sizeValues.md;
  
  return (
    <MotionBox
      whileHover={{ y: -5, scale: 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      bg={cardBg}
      p={4}
      borderRadius="lg"
      shadow="md"
      border="1px solid"
      borderColor={borderColor}
      opacity={badge.earned ? 1 : 0.6}
      className="mycred-rank-image"
    >
      <VStack spacing={3} align="center">
        <MotionBox
          whileHover={{ scale: 1.2, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <Box 
            className={`${imageSize} rounded-full overflow-hidden`}
            bg={badge.earned ? `${badge.category === 'special' ? 'yellow' : 'teal'}.100` : 'gray.100'}
            border="3px solid"
            borderColor={badge.earned ? `${badge.category === 'special' ? 'yellow' : 'teal'}.500` : 'gray.300'}
          >
            <img 
              src={badge.image} 
              alt={badge.name} 
              className="w-full h-full object-cover"
            />
          </Box>
        </MotionBox>
        
        <VStack spacing={1}>
          <Text fontWeight="bold" fontSize="sm" textAlign="center">
            {badge.name}
          </Text>
          
          {size !== "sm" && (
            <Text fontSize="xs" color="gray.500" textAlign="center" noOfLines={2}>
              {badge.description}
            </Text>
          )}
          
          {badge.earned ? (
            <ChakraBadge colorScheme="green" fontSize="xs">
              Earned
            </ChakraBadge>
          ) : (
            <ChakraBadge colorScheme="gray" fontSize="xs" variant="outline">
              Locked
            </ChakraBadge>
          )}
        </VStack>
      </VStack>
    </MotionBox>
  );
};

export default BadgeCard;