import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Progress,
  Badge,
  SimpleGrid,
  Circle,
  Flex,
  Button,
  useColorModeValue,
  VisuallyHidden,
  Alert,
  AlertIcon,
  Divider,
  useDisclosure
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import * as FiIcons from 'react-icons/fi';
import { UserController } from '../controllers/UserController';
import { StarController } from '../controllers/StarController';
import SafeIcon from '../common/SafeIcon';
import StarDisplay from './stars/StarDisplay';
import StarAwardModal from './stars/StarAwardModal';
import DailyBonusButton from './dailybonus/DailyBonusButton';
import ParticipationStreakTracker from './participation/ParticipationStreakTracker';

const { FiAward, FiGift, FiTrendingUp, FiCrown, FiShoppingBag, FiStar } = FiIcons;

const MotionBox = motion(Box);
const MotionCircle = motion(Circle);
const MotionButton = motion(Button);

const RewardCard = ({ title, icon, points, description, isAvailable, onRedeem }) => {
  const cardBg = useColorModeValue('white', 'gray.700');

  return (
    <MotionBox
      as="article"
      role="article"
      aria-labelledby={`reward-${title.replace(/\s+/g, '-').toLowerCase()}`}
      whileHover={{ 
        y: -8, 
        boxShadow: isAvailable ? "0 20px 40px rgba(0,0,0,0.1)" : "0 5px 15px rgba(0,0,0,0.05)",
        transition: { duration: 0.3 }
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      bg={cardBg}
      p={6}
      borderRadius="xl"
      shadow="md"
      opacity={isAvailable ? 1 : 0.7}
      position="relative"
      borderTop="4px solid"
      borderTopColor={isAvailable ? "teal.500" : "gray.300"}
      tabIndex={0}
      _focus={{
        outline: '2px solid',
        outlineColor: 'teal.500',
        outlineOffset: '2px'
      }}
    >
      <VStack spacing={4} align="start">
        <motion.div
          whileHover={{ 
            scale: 1.1, 
            rotate: 5,
            transition: { duration: 0.3 }
          }}
          aria-hidden="true"
        >
          <Circle 
            size="50px" 
            bg={isAvailable ? "teal.50" : "gray.50"} 
            color={isAvailable ? "teal.500" : "gray.400"}
          >
            <SafeIcon icon={icon} className="text-2xl" />
          </Circle>
        </motion.div>

        <Heading 
          as="h3" 
          id={`reward-${title.replace(/\s+/g, '-').toLowerCase()}`}
          size="md" 
          color={isAvailable ? "gray.800" : "gray.500"}
        >
          {title}
        </Heading>

        <Text 
          fontSize="sm" 
          color={isAvailable ? "gray.600" : "gray.500"} 
          noOfLines={2}
        >
          {description}
        </Text>

        <HStack>
          <Badge colorScheme={isAvailable ? "teal" : "gray"}>
            {points} points
          </Badge>
          {!isAvailable && (
            <Badge colorScheme="red">Locked</Badge>
          )}
        </HStack>

        <MotionButton
          colorScheme={isAvailable ? "teal" : "gray"}
          size="md"
          width="full"
          isDisabled={!isAvailable}
          variant={isAvailable ? "solid" : "outline"}
          onClick={() => isAvailable && onRedeem(title, points)}
          aria-label={isAvailable ? `Redeem ${title} for ${points} points` : `${title} requires ${points} points to unlock`}
          _focus={{
            outline: '2px solid',
            outlineColor: isAvailable ? 'teal.300' : 'gray.300',
            outlineOffset: '2px'
          }}
          whileHover={{
            scale: isAvailable ? 1.02 : 1,
            transition: { duration: 0.2 }
          }}
          whileTap={{
            scale: isAvailable ? 0.98 : 1
          }}
        >
          {isAvailable ? "Redeem Now" : "Not Available"}
        </MotionButton>
      </VStack>

      <AnimatePresence>
        {!isAvailable && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.05)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-hidden="true"
          >
            <Box bg="white" p={2} borderRadius="md" shadow="md">
              <Text fontSize="sm" fontWeight="bold" color="gray.700">
                Need More Points
              </Text>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionBox>
  );
};

const MilestoneMarker = ({ level, points, isAchieved, isNext }) => {
  return (
    <VStack spacing={1}>
      <MotionCircle
        size="60px"
        bg={isAchieved ? "teal.500" : "gray.100"}
        color={isAchieved ? "white" : "gray.400"}
        border="3px solid"
        borderColor={isNext ? "teal.300" : isAchieved ? "teal.600" : "gray.200"}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        fontWeight="bold"
        fontSize="xl"
        role="img"
        aria-label={`Level ${level}: ${isAchieved ? 'Achieved' : 'Not achieved'} - ${points} points required`}
        tabIndex={0}
        _focus={{
          outline: '2px solid',
          outlineColor: 'teal.500',
          outlineOffset: '2px'
        }}
        whileHover={{
          scale: 1.1,
          transition: { duration: 0.2 }
        }}
      >
        {level}
      </MotionCircle>
      <Badge colorScheme={isAchieved ? "teal" : "gray"}>
        {points} pts
      </Badge>
    </VStack>
  );
};

const Rewards = () => {
  const [user, setUser] = useState(null);
  const [redeemMessage, setRedeemMessage] = useState('');
  const [earnedStars, setEarnedStars] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedStar, setSelectedStar] = useState(null);

  useEffect(() => {
    const userData = UserController.getUser();
    setUser(userData);
    
    // Get earned stars
    const stars = StarController.getEarnedStars(userData?.id);
    setEarnedStars(stars);
    
    // Trigger confetti for milestone achievements
    if (userData.points >= 1000) {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 500);
    }
  }, []);

  const handleRedeem = (rewardTitle, points) => {
    if (user && user.points >= points) {
      // Update user points (mock)
      setUser(prev => ({ ...prev, points: prev.points - points }));
      setRedeemMessage(`Successfully redeemed ${rewardTitle}! ${points} points deducted.`);
      
      // Clear message after 5 seconds
      setTimeout(() => setRedeemMessage(''), 5000);
      
      // Trigger confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      
      // Check if user should earn a star for spending points (Shopping Spree)
      const starController = StarController.checkForStarAwards(
        user.id,
        'spend_points',
        { pointsSpent: points }
      );
      
      // If a star was earned, show star award modal
      if (starController.awardedStars && starController.awardedStars.length > 0) {
        const starId = starController.awardedStars[0].starId;
        const star = StarController.getStarById(starId);
        setSelectedStar(star);
        
        // Update earned stars list
        setEarnedStars(prev => [...prev, star]);
        
        // Show star award modal
        setTimeout(() => {
          onOpen();
        }, 1000);
      }
    }
  };
  
  const handleDailyBonusClaimed = (points) => {
    // Update user's points when daily bonus is claimed
    setUser(prev => prev ? { ...prev, points: prev.points + points } : null);
  };

  if (!user) {
    return (
      <Container maxW="container.xl" py={16}>
        <VStack spacing={8}>
          <Text>Loading your rewards...</Text>
        </VStack>
      </Container>
    );
  }

  const progressValue = Math.min((user.points / 2000) * 100, 100);
  
  const milestones = [
    { level: 1, points: 0, isAchieved: user?.points >= 0 },
    { level: 2, points: 500, isAchieved: user?.points >= 500 },
    { level: 3, points: 1000, isAchieved: user?.points >= 1000 },
    { level: 4, points: 2000, isAchieved: user?.points >= 2000 }
  ];
  
  const nextMilestone = milestones.find(m => !m.isAchieved) || milestones[milestones.length - 1];
  
  const rewardsList = [
    {
      title: "Free Shipping",
      icon: FiGift,
      points: 200,
      description: "Get free shipping on your next purchase",
      isAvailable: user?.points >= 200
    },
    {
      title: "10% Discount",
      icon: FiTrendingUp,
      points: 500,
      description: "10% off your next purchase with this reward",
      isAvailable: user?.points >= 500
    },
    {
      title: "VIP Status",
      icon: FiCrown,
      points: 1000,
      description: "Unlock VIP status with exclusive benefits",
      isAvailable: user?.points >= 1000
    },
    {
      title: "Premium Gift",
      icon: FiAward,
      points: 1500,
      description: "Redeem for a premium surprise gift",
      isAvailable: user?.points >= 1500
    },
    {
      title: "Shopping Spree",
      icon: FiShoppingBag,
      points: 2500,
      description: "$100 shopping credit to use anywhere",
      isAvailable: user?.points >= 2500
    },
    {
      title: "Exclusive Experience",
      icon: FiCrown,
      points: 5000,
      description: "VIP experience package worth $500",
      isAvailable: user?.points >= 5000
    }
  ];

  return (
    <Box as="main" role="main">
      {/* Hero Section with User Greeting */}
      <Box 
        as="section" 
        aria-labelledby="rewards-hero" 
        bgGradient="linear(to-r, teal.500, teal.400)" 
        color="white" 
        py={12}
      >
        <Container maxW="container.xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <VStack spacing={6} align="center">
              <Heading as="h1" id="rewards-hero" size="xl">
                Hi {user.name}, Your Rewards Await!
              </Heading>
              <Text fontSize="lg" textAlign="center" maxW="600px">
                You have {user.points.toLocaleString()} points ready to redeem. Track your streaks, unlock exclusive rewards, and celebrate your achievements below.
              </Text>
              
              {/* Stars display in hero section */}
              {earnedStars.length > 0 && (
                <Box mt={2}>
                  <VStack spacing={2}>
                    <Badge colorScheme="white" variant="outline" fontSize="sm">
                      Your Stars Collection
                    </Badge>
                    <StarDisplay 
                      stars={earnedStars} 
                      size="md" 
                      maxStars={5}
                      showTooltip={true}
                    />
                  </VStack>
                </Box>
              )}
            </VStack>
          </motion.div>
        </Container>
      </Box>

      <Container maxW="container.xl" py={16}>
        <VStack spacing={16}>
          {/* Success Message */}
          <AnimatePresence>
            {redeemMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%', maxWidth: '600px' }}
              >
                <Alert status="success" borderRadius="md">
                  <AlertIcon />
                  {redeemMessage}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Points Display */}
          <MotionBox 
            as="section" 
            aria-labelledby="points-balance"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            w="full"
            maxW="600px"
            bg="white"
            p={8}
            borderRadius="xl"
            shadow="md"
          >
            <VStack spacing={6}>
              <Heading as="h2" id="points-balance" size="md" color="gray.600">
                Your Points Balance
              </Heading>
              
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Flex 
                  justify="center" 
                  align="center" 
                  bg="teal.50" 
                  w="150px" 
                  h="150px" 
                  borderRadius="full"
                  border="4px solid"
                  borderColor="teal.100"
                  role="img"
                  aria-label={`Current points balance: ${user?.points} points`}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Text 
                      fontSize="4xl" 
                      fontWeight="bold" 
                      color="teal.500"
                      lineHeight="1"
                    >
                      {user?.points.toLocaleString()}
                    </Text>
                  </motion.div>
                </Flex>
              </motion.div>
              
              <VStack w="full" spacing={1}>
                <Text fontSize="sm" color="gray.600" alignSelf="flex-start">
                  Level Progress ({user?.points} / {nextMilestone?.points || 2000})
                </Text>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  style={{ width: '100%' }}
                >
                  <Progress 
                    value={progressValue} 
                    size="lg" 
                    colorScheme="teal" 
                    borderRadius="full" 
                    w="full"
                    role="progressbar"
                    aria-valuenow={progressValue}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Progress to next level: ${Math.round(progressValue)}%`}
                  />
                </motion.div>
              </VStack>
              
              <HStack w="full" justify="space-between" px={4} role="list" aria-label="Milestone levels">
                {milestones.map((milestone, index) => (
                  <Box key={index} role="listitem">
                    <MilestoneMarker 
                      level={milestone.level} 
                      points={milestone.points}
                      isAchieved={milestone.isAchieved}
                      isNext={!milestone.isAchieved && milestone.points === nextMilestone?.points}
                    />
                  </Box>
                ))}
              </HStack>
              
              <AnimatePresence>
                {user?.points >= 1000 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ duration: 0.5 }}
                    role="alert"
                    aria-live="polite"
                  >
                    <Badge colorScheme="green" p={2} fontSize="md">
                      🎉 Level 3 Achieved!
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </VStack>
          </MotionBox>

          {/* Participation Streak Tracker */}
          <Box as="section" aria-labelledby="participation-streak" w="full">
            <VStack spacing={8} w="full">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Heading as="h2" id="participation-streak" size="lg" color="gray.800" className="text-teal-500">
                  Participation Streak Awards
                </Heading>
              </motion.div>
              
              <ParticipationStreakTracker />
            </VStack>
          </Box>
          
          {/* Daily Bonus Section */}
          <Box as="section" aria-labelledby="daily-bonus" w="full">
            <VStack spacing={8} w="full">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Heading as="h2" id="daily-bonus" size="lg" color="gray.800">
                  Daily Bonus
                </Heading>
              </motion.div>
              
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                bg="white"
                p={8}
                borderRadius="xl"
                shadow="md"
                w="full"
                maxW="600px"
                textAlign="center"
              >
                <VStack spacing={6}>
                  <Text color="gray.600" fontSize="lg">
                    Come back daily to claim bonus points and build your streak!
                  </Text>
                  
                  <DailyBonusButton onClaim={handleDailyBonusClaimed} />
                  
                  <Divider />
                  
                  <Text fontSize="sm" color="gray.500">
                    Your streak increases your daily bonus. Every 5 consecutive days unlocks a milestone bonus!
                  </Text>
                </VStack>
              </MotionBox>
            </VStack>
          </Box>

          {/* Stars Section */}
          {earnedStars.length > 0 && (
            <Box as="section" aria-labelledby="earned-stars" w="full">
              <VStack spacing={8} w="full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Heading as="h2" id="earned-stars" size="lg" color="gray.800">
                    Your Earned Stars
                  </Heading>
                </motion.div>
                
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  bg="white"
                  p={6}
                  borderRadius="xl"
                  shadow="md"
                  w="full"
                  maxW="800px"
                >
                  <VStack spacing={4} align="center">
                    <Text color="gray.600" fontSize="lg" textAlign="center">
                      You've earned {earnedStars.length} of 10 possible stars
                    </Text>
                    
                    <StarDisplay 
                      stars={earnedStars} 
                      size="lg" 
                      showTooltip={true}
                      showEmpty={true}
                    />
                    
                    <Divider my={2} />
                    
                    <Text fontSize="sm" color="gray.500" textAlign="center">
                      Complete special achievements to earn more stars and boost your level progress!
                    </Text>
                  </VStack>
                </MotionBox>
              </VStack>
            </Box>
          )}

          {/* Available Rewards */}
          <Box as="section" aria-labelledby="available-rewards" w="full">
            <VStack spacing={8} w="full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Heading as="h2" id="available-rewards" size="lg" color="gray.800">
                  Available Rewards
                </Heading>
                <VisuallyHidden>
                  <Text>
                    Browse and redeem rewards using your earned points.
                    {user?.points ? ` You currently have ${user.points} points available.` : ''}
                  </Text>
                </VisuallyHidden>
              </motion.div>
              
              <SimpleGrid 
                columns={{ base: 1, md: 2, lg: 3 }} 
                spacing={8} 
                w="full"
                role="list"
                aria-label="Available rewards"
              >
                {rewardsList.map((reward, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + (index * 0.1) }}
                    role="listitem"
                  >
                    <RewardCard 
                      {...reward} 
                      onRedeem={handleRedeem}
                    />
                  </motion.div>
                ))}
              </SimpleGrid>
            </VStack>
          </Box>
        </VStack>
      </Container>

      {/* Star Award Modal */}
      {selectedStar && (
        <StarAwardModal
          isOpen={isOpen}
          onClose={onClose}
          star={selectedStar}
          pointsEarned={selectedStar.pointsValue}
        />
      )}
    </Box>
  );
};

export default Rewards;