import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  Badge,
  Heading,
  Flex,
  Spacer,
  useColorModeValue,
  Tooltip
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiAward, FiTrophy, FiArrowUp } = FiIcons;

const MotionBox = motion(Box);

const LevelProgressCard = ({ level, title, currentPoints, pointsToNextLevel, totalPointsForCurrentLevel, totalPointsForNextLevel }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const progressValue = Math.min(
    Math.round(
      ((currentPoints - totalPointsForCurrentLevel) / 
      (totalPointsForNextLevel - totalPointsForCurrentLevel)) * 100
    ),
    100
  );

  const getLevelColor = (level) => {
    const colors = [
      'blue.500',    // Level 1
      'teal.500',    // Level 2
      'green.500',   // Level 3
      'yellow.500',  // Level 4
      'orange.500',  // Level 5
      'red.500',     // Level 6
      'purple.500',  // Level 7
      'pink.500',    // Level 8
      'cyan.500',    // Level 9
      'gold',        // Level 10
    ];
    return colors[(level - 1) % colors.length];
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      bg={cardBg}
      p={6}
      borderRadius="xl"
      shadow="md"
      borderLeft="4px solid"
      borderLeftColor={getLevelColor(level)}
    >
      <VStack spacing={4} align="stretch">
        <HStack>
          <Flex
            w="50px"
            h="50px"
            borderRadius="full"
            bg={`${getLevelColor(level)}20`}
            justify="center"
            align="center"
            border="2px solid"
            borderColor={getLevelColor(level)}
          >
            <SafeIcon icon={FiTrophy} className={`text-xl text-${getLevelColor(level)}`} />
          </Flex>
          <VStack align="start" spacing={0}>
            <HStack>
              <Heading size="md" color="gray.800">Level {level}</Heading>
              <Badge 
                colorScheme={level >= 5 ? "yellow" : level >= 3 ? "green" : "blue"} 
                fontSize="sm"
                variant="solid"
              >
                {title}
              </Badge>
            </HStack>
            <Text fontSize="sm" color="gray.600">
              {pointsToNextLevel > 0 ? 
                `${pointsToNextLevel} points to Level ${level + 1}` : 
                "Maximum level reached!"}
            </Text>
          </VStack>
        </HStack>

        <VStack spacing={1} align="stretch">
          <HStack justify="space-between">
            <Text fontSize="xs" color="gray.500">Progress to next level</Text>
            <HStack spacing={1}>
              <SafeIcon icon={FiArrowUp} className="text-xs" />
              <Text fontSize="xs" fontWeight="bold">{progressValue}%</Text>
            </HStack>
          </HStack>
          
          <Tooltip 
            label={`${currentPoints - totalPointsForCurrentLevel} of ${totalPointsForNextLevel - totalPointsForCurrentLevel} points earned for this level`}
            placement="top"
            hasArrow
          >
            <Box w="100%">
              <Progress 
                value={progressValue} 
                size="md" 
                colorScheme="teal" 
                borderRadius="full"
                bg="gray.100"
                hasStripe
                isAnimated
              />
            </Box>
          </Tooltip>
          
          <HStack justify="space-between" mt={1}>
            <Text fontSize="xs" color="gray.500">Level {level}</Text>
            <Text fontSize="xs" color="gray.500">Level {level + 1}</Text>
          </HStack>
        </VStack>
      </VStack>
    </MotionBox>
  );
};

export default LevelProgressCard;