import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Badge,
  useColorModeValue,
  Tooltip
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiStar, FiCalendar, FiAward } = FiIcons;

const MotionBox = motion(Box);

const StarCard = ({ star }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  
  return (
    <MotionBox
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      bg={cardBg}
      p={4}
      borderRadius="md"
      shadow="md"
      border="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.600')}
      opacity={star.earned ? 1 : 0.6}
      position="relative"
      overflow="hidden"
    >
      {/* Background decoration */}
      <Box
        position="absolute"
        top={-10}
        right={-10}
        width="100px"
        height="100px"
        borderRadius="full"
        bg={`${star.color}10`}
        zIndex={0}
      />
      
      <VStack spacing={3} align="stretch" position="relative" zIndex={1}>
        <HStack justify="space-between">
          {/* Star icon */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxSize="40px"
            borderRadius="full"
            bg={star.earned ? `${star.color}20` : "gray.100"}
            color={star.earned ? star.color : "gray.400"}
          >
            <SafeIcon icon={FiStar} className={star.earned ? "text-xl fill-current" : "text-xl"} />
          </Box>
          
          {/* Points badge */}
          <Tooltip label="Points earned for this star" placement="top">
            <Badge 
              colorScheme={star.earned ? "teal" : "gray"} 
              display="flex" 
              alignItems="center"
              px={2}
              py={1}
            >
              <SafeIcon icon={FiAward} className="mr-1 text-xs" />
              <Text>{star.pointsValue} pts</Text>
            </Badge>
          </Tooltip>
        </HStack>
        
        {/* Star details */}
        <VStack align="start" spacing={1}>
          <Text fontWeight="bold" fontSize="md" color={star.earned ? "gray.800" : "gray.500"}>
            {star.name}
          </Text>
          <Text fontSize="sm" color={textColor} noOfLines={2}>
            {star.description}
          </Text>
        </VStack>
        
        {/* Earned date if applicable */}
        {star.earned && star.earnedDate && (
          <HStack fontSize="xs" color="gray.500">
            <SafeIcon icon={FiCalendar} className="text-xs" />
            <Text>Earned: {star.earnedDate}</Text>
          </HStack>
        )}
        
        {/* Status indicator */}
        <Badge 
          alignSelf="flex-start" 
          colorScheme={star.earned ? "green" : "gray"}
          variant={star.earned ? "solid" : "outline"}
        >
          {star.earned ? "Earned" : "Locked"}
        </Badge>
      </VStack>
    </MotionBox>
  );
};

export default StarCard;