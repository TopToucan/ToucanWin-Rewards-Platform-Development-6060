import React from 'react';
import { HStack, Box, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const BadgeDisplay = ({ badges, size = "md", showTooltip = true, maxBadges = null }) => {
  // Determine the number of badges to display
  const displayBadges = maxBadges ? badges.slice(0, maxBadges) : badges;
  const remainingCount = maxBadges && badges.length > maxBadges ? badges.length - maxBadges : 0;
  
  // Size values for the badge image
  const sizeValues = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };
  
  const imageSize = sizeValues[size] || sizeValues.md;
  
  return (
    <HStack spacing={2} flexWrap="wrap">
      {displayBadges.map((badge, index) => (
        <Tooltip 
          key={badge.id}
          label={`${badge.name}: ${badge.description}`}
          isDisabled={!showTooltip}
          placement="top"
          hasArrow
        >
          <MotionBox
            display="flex"
            alignItems="center"
            justifyContent="center"
            className={`${imageSize} rounded-full overflow-hidden mycred-rank-image`}
            bg={useColorModeValue(`${badge.category === 'special' ? 'yellow' : 'teal'}.100`, `${badge.category === 'special' ? 'yellow' : 'teal'}.900`)}
            border="2px solid"
            borderColor={useColorModeValue(`${badge.category === 'special' ? 'yellow' : 'teal'}.500`, `${badge.category === 'special' ? 'yellow' : 'teal'}.300`)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1
            }}
            transition={{ 
              duration: 0.3, 
              delay: 0.05 * index 
            }}
            whileHover={{ 
              scale: 1.2, 
              zIndex: 1,
              transition: { duration: 0.2 }
            }}
          >
            <img 
              src={badge.image} 
              alt={badge.name} 
              className="w-full h-full object-cover"
            />
          </MotionBox>
        </Tooltip>
      ))}
      
      {/* Remaining count indicator */}
      {remainingCount > 0 && (
        <Tooltip 
          label={`${remainingCount} more badge${remainingCount !== 1 ? 's' : ''}`}
          placement="top"
          hasArrow
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            className={`${imageSize} rounded-full`}
            bg="teal.100"
            color="teal.800"
            fontWeight="bold"
            fontSize="xs"
            border="2px solid"
            borderColor="teal.500"
          >
            +{remainingCount}
          </Box>
        </Tooltip>
      )}
    </HStack>
  );
};

export default BadgeDisplay;