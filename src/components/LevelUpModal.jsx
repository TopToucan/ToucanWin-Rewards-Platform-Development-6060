import React, { useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  Heading,
  Box,
  Flex,
  Badge,
  List,
  ListItem,
  ListIcon,
  useColorModeValue
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { UserController } from '../controllers/UserController';

const { FiAward, FiCheck, FiStar } = FiIcons;

const MotionBox = motion(Box);

const LevelUpModal = ({ isOpen, onClose, newLevel, previousLevel }) => {
  const benefits = UserController.getLevelBenefits(newLevel);
  const latestBenefits = benefits[benefits.length - 1]?.benefits || [];
  const bgColor = useColorModeValue('white', 'gray.800');
  
  // Trigger confetti when modal opens
  useEffect(() => {
    if (isOpen) {
      // Multiple confetti bursts for a more celebratory effect
      const duration = 3000;
      const end = Date.now() + duration;
      
      // First burst - center
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Continuous bursts from sides
      const interval = setInterval(() => {
        if (Date.now() > end) {
          return clearInterval(interval);
        }
        
        // Left side
        confetti({
          particleCount: 20,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.5 }
        });
        
        // Right side
        confetti({
          particleCount: 20,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.5 }
        });
      }, 250);
      
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg" motionPreset="slideInBottom">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="xl" overflow="hidden" bg={bgColor}>
        {/* Celebration Header */}
        <Box bg="teal.500" py={6} px={6} color="white" textAlign="center">
          <AnimatePresence>
            <MotionBox
              initial={{ opacity: 0, scale: 0.5, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <VStack spacing={2}>
                <SafeIcon icon={FiAward} className="text-4xl" />
                <Heading size="lg">Congratulations!</Heading>
                <Text fontSize="xl" fontWeight="bold">
                  You've Reached Level {newLevel}
                </Text>
                <Badge colorScheme="yellow" px={3} py={1} borderRadius="full" fontSize="md">
                  {UserModel.getLevelTitle(newLevel)}
                </Badge>
              </VStack>
            </MotionBox>
          </AnimatePresence>
        </Box>

        <ModalCloseButton color="white" />
        
        <ModalBody py={6}>
          <VStack spacing={6} align="stretch">
            {/* Level up message */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Text textAlign="center" fontSize="lg">
                You've advanced from Level {previousLevel} to Level {newLevel}!
              </Text>
            </MotionBox>
            
            {/* New benefits */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Box bg="teal.50" p={4} borderRadius="md">
                <Heading size="sm" mb={3} color="teal.700">
                  New Benefits Unlocked:
                </Heading>
                
                <List spacing={3}>
                  {latestBenefits.map((benefit, index) => (
                    <MotionBox
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
                    >
                      <ListItem display="flex" alignItems="center">
                        <ListIcon as={FiStar} color="yellow.500" />
                        <Box>
                          <Text fontWeight="bold">{benefit.name}</Text>
                          <Text fontSize="sm" color="gray.600">{benefit.description}</Text>
                        </Box>
                      </ListItem>
                    </MotionBox>
                  ))}
                </List>
              </Box>
            </MotionBox>
            
            {/* Keep earning message */}
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Keep earning points to unlock even more exclusive benefits!
              </Text>
            </MotionBox>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="teal" onClick={onClose} size="lg" width="full">
            Continue Your Journey
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LevelUpModal;