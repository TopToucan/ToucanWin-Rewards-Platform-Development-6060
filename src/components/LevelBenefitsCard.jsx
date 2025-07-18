import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Heading,
  List,
  ListItem,
  ListIcon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorModeValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCheck, FiLock, FiStar } = FiIcons;

const MotionBox = motion(Box);

const LevelBenefitsCard = ({ level, allLevelBenefits }) => {
  const cardBg = useColorModeValue('white', 'gray.700');

  const getLevelColor = (lvl) => {
    const colors = [
      'blue',    // Level 1
      'teal',    // Level 2
      'green',   // Level 3
      'yellow',  // Level 4
      'orange',  // Level 5
      'red',     // Level 6
      'purple',  // Level 7
      'pink',    // Level 8
      'cyan',    // Level 9
      'yellow',  // Level 10 (gold)
    ];
    return colors[(lvl - 1) % colors.length];
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      bg={cardBg}
      p={6}
      borderRadius="xl"
      shadow="md"
    >
      <VStack spacing={4} align="stretch">
        <HStack>
          <SafeIcon icon={FiStar} className="text-2xl text-teal-500" />
          <Heading size="md">Member Benefits</Heading>
        </HStack>
        
        <Accordion allowToggle defaultIndex={[0]}>
          {allLevelBenefits.map((levelData, index) => {
            const isCurrentLevel = levelData.level === level;
            const isUnlocked = levelData.level <= level;
            const colorScheme = getLevelColor(levelData.level);
            
            return (
              <AccordionItem 
                key={levelData.level} 
                border="none" 
                mb={2}
                bg={isCurrentLevel ? `${colorScheme}.50` : 'transparent'}
                borderRadius="md"
              >
                <AccordionButton 
                  p={3} 
                  borderRadius="md"
                  _hover={{ bg: `${colorScheme}.50` }}
                >
                  <HStack flex="1" textAlign="left" spacing={3}>
                    <Badge 
                      colorScheme={colorScheme} 
                      fontSize="sm" 
                      borderRadius="full" 
                      px={2}
                    >
                      {isUnlocked ? 
                        <HStack spacing={1}>
                          <SafeIcon icon={FiCheck} className="text-xs" />
                          <Text>Lv {levelData.level}</Text>
                        </HStack> : 
                        <HStack spacing={1}>
                          <SafeIcon icon={FiLock} className="text-xs" />
                          <Text>Lv {levelData.level}</Text>
                        </HStack>
                      }
                    </Badge>
                    <Text 
                      fontWeight={isCurrentLevel ? "bold" : "medium"}
                      color={isUnlocked ? "gray.700" : "gray.400"}
                    >
                      {levelData.title}
                    </Text>
                    {isCurrentLevel && (
                      <Badge colorScheme="green" fontSize="xs">
                        Current
                      </Badge>
                    )}
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                
                <AccordionPanel pb={4} px={3}>
                  <List spacing={2}>
                    {levelData.benefits.map((benefit, benefitIndex) => (
                      <ListItem 
                        key={benefitIndex}
                        opacity={isUnlocked ? 1 : 0.5}
                      >
                        <HStack align="start" spacing={2}>
                          <ListIcon 
                            as={isUnlocked ? FiCheck : FiLock} 
                            color={isUnlocked ? `${colorScheme}.500` : "gray.400"} 
                            mt={1}
                          />
                          <VStack align="start" spacing={0}>
                            <Text 
                              fontWeight="medium"
                              color={isUnlocked ? "gray.700" : "gray.400"}
                            >
                              {benefit.name}
                            </Text>
                            <Text 
                              fontSize="xs" 
                              color="gray.500"
                              fontStyle="italic"
                            >
                              {benefit.description}
                            </Text>
                          </VStack>
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                </AccordionPanel>
              </AccordionItem>
            );
          })}
        </Accordion>
        
        <Text fontSize="xs" color="gray.500" textAlign="center" mt={2}>
          Keep earning points to unlock higher levels and exclusive benefits
        </Text>
      </VStack>
    </MotionBox>
  );
};

export default LevelBenefitsCard;