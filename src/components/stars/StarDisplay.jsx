import React from 'react';
import { 
  HStack, 
  Box, 
  Tooltip, 
  useColorModeValue, 
  VStack, 
  Text,
  Badge
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiStar } = FiIcons;

const MotionBox = motion(Box);

const StarDisplay = ({ stars, size = "md", showTooltip = true, maxStars = null, showEmpty = false }) => {
  // Determine the number of stars to display
  const displayStars = maxStars ? stars.slice(0, maxStars) : stars;
  const remainingCount = maxStars && stars.length > maxStars ? stars.length - maxStars : 0;
  
  // Calculate size values
  const sizeValues = {
    sm: { boxSize: "20px", fontSize: "12px" },
    md: { boxSize: "30px", fontSize: "16px" },
    lg: { boxSize: "40px", fontSize: "20px" }
  };
  
  const { boxSize, fontSize } = sizeValues[size] || sizeValues.md;
  
  // Determine if we're showing empty star placeholders
  const totalSlots = showEmpty ? Math.max(stars.length, 10) : stars.length;
  const emptySlots = showEmpty ? totalSlots - stars.length : 0;

  return (
    <HStack spacing={2} flexWrap="wrap">
      {displayStars.map((star, index) => (
        <Tooltip 
          key={star.id} 
          label={`${star.name}: ${star.description}`}
          isDisabled={!showTooltip}
          placement="top"
          hasArrow
        >
          <MotionBox
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxSize={boxSize}
            borderRadius="full"
            bg={useColorModeValue(`${star.color}20`, `${star.color}30`)}
            color={star.color}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: 1, 
              rotate: 0,
              transition: { 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.05 * index 
              } 
            }}
            whileHover={{ 
              scale: 1.2, 
              rotate: 15,
              transition: { duration: 0.2 } 
            }}
          >
            <SafeIcon icon={FiStar} style={{ fontSize }} className="fill-current" />
          </MotionBox>
        </Tooltip>
      ))}
      
      {/* Remaining count indicator */}
      {remainingCount > 0 && (
        <Tooltip 
          label={`${remainingCount} more star${remainingCount !== 1 ? 's' : ''}`}
          placement="top"
          hasArrow
        >
          <Badge
            borderRadius="full"
            px={2}
            py={1}
            bg="teal.100"
            color="teal.800"
            fontWeight="bold"
          >
            +{remainingCount}
          </Badge>
        </Tooltip>
      )}
      
      {/* Empty star placeholders */}
      {showEmpty && emptySlots > 0 && Array(emptySlots).fill(0).map((_, index) => (
        <Box
          key={`empty-${index}`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxSize={boxSize}
          borderRadius="full"
          bg={useColorModeValue("gray.100", "gray.700")}
          color={useColorModeValue("gray.300", "gray.600")}
        >
          <SafeIcon icon={FiStar} style={{ fontSize }} />
        </Box>
      ))}
    </HStack>
  );
};

export default StarDisplay;