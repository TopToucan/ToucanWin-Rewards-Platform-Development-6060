import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Avatar,
  Badge,
  Divider,
  Image,
  Button,
  SimpleGrid,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  Flex,
  Spacer,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { UserController } from '../controllers/UserController';
import { StarController } from '../controllers/StarController';
import { BadgeController } from '../controllers/BadgeController';
import LevelProgressCard from './LevelProgressCard';
import LevelBenefitsCard from './LevelBenefitsCard';
import LevelUpModal from './LevelUpModal';
import StarDisplay from './stars/StarDisplay';
import StarAchievements from './stars/StarAchievements';
import BadgeDisplay from './badges/BadgeDisplay';
import BadgeGallery from './badges/BadgeGallery';
import BadgeAwardModal from './badges/BadgeAwardModal';

const { FiUser, FiAward, FiTrendingUp, FiTarget, FiEdit, FiSettings, FiTrophy, FiStar } = FiIcons;

const MotionBox = motion(Box);

const StatCard = ({ icon, label, value, change, color = "teal" }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  
  return (
    <MotionBox
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      bg={cardBg}
      p={6}
      borderRadius="xl"
      shadow="md"
      borderLeft="4px solid"
      borderLeftColor={`${color}.500`}
    >
      <Stat>
        <HStack spacing={3} mb={2}>
          <Box color={`${color}.500`}>
            <SafeIcon icon={icon} className="text-2xl" />
          </Box>
          <StatLabel fontSize="sm" color="gray.500">{label}</StatLabel>
        </HStack>
        <StatNumber fontSize="2xl" color="gray.800">{value}</StatNumber>
        {change !== undefined && (
          <StatHelpText>
            <StatArrow type={change >= 0 ? 'increase' : 'decrease'} />
            {Math.abs(change)}% from last month
          </StatHelpText>
        )}
      </Stat>
    </MotionBox>
  );
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [levelUpInfo, setLevelUpInfo] = useState(null);
  const [earnedStars, setEarnedStars] = useState([]);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState(null);
  
  const { isOpen: isLevelUpOpen, onOpen: onLevelUpOpen, onClose: onLevelUpClose } = useDisclosure();
  const { isOpen: isBadgeOpen, onOpen: onBadgeOpen, onClose: onBadgeClose } = useDisclosure();
  
  const cardBg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    const userData = UserController.getUser();
    setUser(userData);
    
    // Get earned stars
    const stars = StarController.getEarnedStars(userData?.id);
    setEarnedStars(stars);
    
    // Get earned badges
    const badges = BadgeController.getEarnedBadges(userData?.id);
    setEarnedBadges(badges);
  }, []);

  // Simulate a level up for demonstration purposes
  const simulateLevelUp = () => {
    setLevelUpInfo({ newLevel: user.level + 1, previousLevel: user.level });
    onLevelUpOpen();
  };
  
  // Simulate earning a new badge
  const simulateEarnBadge = () => {
    // Pick a random unearned badge
    const unearnedBadges = BadgeController.getUnearnedBadges(user?.id);
    if (unearnedBadges.length > 0) {
      const randomBadge = unearnedBadges[Math.floor(Math.random() * unearnedBadges.length)];
      setSelectedBadge(randomBadge);
      onBadgeOpen();
      
      // Add the badge to earned badges for UI update
      setEarnedBadges([...earnedBadges, { ...randomBadge, earned: true, earnedDate: new Date().toISOString().split('T')[0] }]);
    }
  };

  if (!user) {
    return (
      <Container maxW="container.xl" p={8}>
        <VStack spacing={6} py={10}>
          <Text>Loading profile...</Text>
        </VStack>
      </Container>
    );
  }

  // Get level benefits
  const allLevelBenefits = UserController.getAllLevelBenefits();

  return (
    <Box>
      {/* Hero Section with Welcome Message */}
      <Box 
        bgGradient="linear(to-r, teal.500, teal.400)" 
        color="white" 
        py={12}
      >
        <Container maxW="container.xl">
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <VStack spacing={6} align="center" textAlign="center">
              <Avatar 
                size="2xl" 
                name={user.name} 
                bg="white" 
                color="teal.500" 
                border="4px solid white"
              />
              <VStack spacing={2}>
                <Heading size="xl">Welcome back, {user.name}!</Heading>
                <HStack>
                  <Text fontSize="lg" opacity={0.9}>
                    {user.points.toLocaleString()} points 
                  </Text>
                  <Text fontSize="lg" opacity={0.9}>•</Text>
                  <Badge 
                    colorScheme={user.level >= 5 ? "yellow" : user.level >= 3 ? "green" : "blue"}
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="md"
                  >
                    Level {user.level}: {user.title}
                  </Badge>
                </HStack>
              </VStack>
              
              {/* Stars display in the header */}
              {earnedStars.length > 0 && (
                <Box mt={2}>
                  <StarDisplay 
                    stars={earnedStars} 
                    size="md" 
                    maxStars={5}
                    showTooltip={true}
                  />
                </Box>
              )}
              
              {/* Badges display in the header */}
              {earnedBadges.length > 0 && (
                <Box mt={2}>
                  <BadgeDisplay 
                    badges={earnedBadges} 
                    size="md" 
                    maxBadges={5}
                    showTooltip={true}
                  />
                </Box>
              )}
              
              <HStack spacing={4} mt={2}>
                <Button 
                  leftIcon={<SafeIcon icon={FiEdit} />} 
                  bg="white" 
                  color="teal.500"
                  _hover={{ bg: 'gray.100' }}
                >
                  Edit Profile
                </Button>
                <Button 
                  leftIcon={<SafeIcon icon={FiSettings} />} 
                  variant="outline" 
                  borderColor="white"
                  color="white"
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  Settings
                </Button>
              </HStack>
            </VStack>
          </MotionBox>
        </Container>
      </Box>

      <Container maxW="container.xl" py={12}>
        <Tabs variant="soft-rounded" colorScheme="teal" isLazy>
          <TabList mb={8}>
            <Tab><HStack><SafeIcon icon={FiUser} />Profile</HStack></Tab>
            <Tab><HStack><SafeIcon icon={FiStar} />Stars</HStack></Tab>
            <Tab><HStack><SafeIcon icon={FiAward} />Badges</HStack></Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel p={0}>
              <VStack spacing={12} align="stretch">
                {/* Stats Grid */}
                <VStack spacing={6} align="stretch">
                  <Heading size="lg" color="gray.800">Your Activity</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                    <StatCard 
                      icon={FiAward} 
                      label="Total Points" 
                      value={user.points.toLocaleString()} 
                      change={12}
                      color="teal"
                    />
                    <StatCard 
                      icon={FiTarget} 
                      label="Campaigns Joined" 
                      value={user.campaignsJoined || 8} 
                      change={25}
                      color="purple"
                    />
                    <StatCard 
                      icon={FiTrendingUp} 
                      label="Auctions Won" 
                      value={user.auctionsWon || 3} 
                      change={50}
                      color="green"
                    />
                    <StatCard 
                      icon={FiStar} 
                      label="Stars Earned" 
                      value={earnedStars.length} 
                      color="yellow"
                    />
                  </SimpleGrid>
                </VStack>

                {/* Level Progress Section */}
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                  {/* Level Progress Card */}
                  <LevelProgressCard
                    level={user.level}
                    title={user.title}
                    currentPoints={user.points}
                    pointsToNextLevel={user.pointsToNextLevel}
                    totalPointsForCurrentLevel={user.totalPointsForCurrentLevel}
                    totalPointsForNextLevel={user.totalPointsForNextLevel}
                  />

                  {/* Level Benefits Card */}
                  <LevelBenefitsCard
                    level={user.level}
                    allLevelBenefits={allLevelBenefits}
                  />
                </SimpleGrid>

                {/* Stars and Badges Sections */}
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                  {/* Stars Section */}
                  {earnedStars.length > 0 && (
                    <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
                      <VStack spacing={4} align="stretch">
                        <HStack justify="space-between">
                          <HStack spacing={3}>
                            <SafeIcon icon={FiStar} className="text-2xl text-yellow-400" />
                            <Heading size="md">Your Stars</Heading>
                          </HStack>
                          <Button 
                            variant="link" 
                            colorScheme="teal" 
                            onClick={() => document.getElementById('stars-tab').click()}
                            rightIcon={<SafeIcon icon={FiStar} />}
                          >
                            View All
                          </Button>
                        </HStack>
                        
                        <StarDisplay 
                          stars={earnedStars} 
                          size="md" 
                          showTooltip={true}
                          showEmpty={false}
                        />
                      </VStack>
                    </Box>
                  )}
                  
                  {/* Badges Section */}
                  <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
                    <VStack spacing={4} align="stretch">
                      <HStack justify="space-between">
                        <HStack spacing={3}>
                          <SafeIcon icon={FiAward} className="text-2xl text-teal-500" />
                          <Heading size="md">Your Badges</Heading>
                        </HStack>
                        <Button 
                          variant="link" 
                          colorScheme="teal" 
                          onClick={() => document.getElementById('badges-tab').click()}
                          rightIcon={<SafeIcon icon={FiAward} />}
                        >
                          View All
                        </Button>
                      </HStack>
                      
                      {earnedBadges.length > 0 ? (
                        <BadgeDisplay 
                          badges={earnedBadges} 
                          size="lg" 
                          showTooltip={true}
                        />
                      ) : (
                        <Box py={4} textAlign="center">
                          <Text color="gray.500">
                            You haven't earned any badges yet. Complete activities to earn badges!
                          </Text>
                        </Box>
                      )}
                    </VStack>
                  </Box>
                </SimpleGrid>

                {/* Quick Actions */}
                <Box bg={cardBg} p={8} borderRadius="xl" shadow="md">
                  <VStack spacing={6}>
                    <Heading size="md">Quick Actions</Heading>
                    <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} w="full">
                      <Button 
                        size="lg" 
                        colorScheme="teal" 
                        leftIcon={<SafeIcon icon={FiAward} />}
                        py={8}
                      >
                        View Rewards
                      </Button>
                      <Button 
                        size="lg" 
                        colorScheme="purple" 
                        variant="outline" 
                        leftIcon={<SafeIcon icon={FiTarget} />}
                        py={8}
                      >
                        Join Campaign
                      </Button>
                      <Button 
                        size="lg" 
                        colorScheme="green" 
                        variant="outline" 
                        leftIcon={<SafeIcon icon={FiTrendingUp} />}
                        py={8}
                      >
                        Browse Auctions
                      </Button>
                      {/* For demonstration purposes */}
                      <Button 
                        size="lg" 
                        colorScheme="yellow" 
                        variant="outline" 
                        leftIcon={<SafeIcon icon={FiAward} />}
                        py={8}
                        onClick={simulateEarnBadge}
                      >
                        Earn Badge
                      </Button>
                    </SimpleGrid>
                  </VStack>
                </Box>

                {/* Recent Activity */}
                <Box bg={cardBg} p={8} borderRadius="xl" shadow="md">
                  <VStack spacing={6} align="stretch">
                    <Heading size="md">Recent Activity</Heading>
                    <VStack spacing={4} align="stretch">
                      {[
                        { 
                          action: "Earned 150 points", 
                          description: "Receipt upload - Grocery Store", 
                          time: "2 hours ago",
                          type: "earn" 
                        },
                        { 
                          action: "Earned Badge: Receipt Pro", 
                          description: "Upload 20 receipts", 
                          time: "1 day ago",
                          type: "badge" 
                        },
                        { 
                          action: "Earned Star: Receipt Master", 
                          description: "Upload 10 receipts", 
                          time: "1 day ago",
                          type: "star" 
                        },
                        { 
                          action: "Joined Summer Campaign", 
                          description: "Bonus points for seasonal purchases", 
                          time: "1 day ago",
                          type: "campaign" 
                        },
                        { 
                          action: "Won auction", 
                          description: "Premium Headphones", 
                          time: "3 days ago",
                          type: "auction" 
                        },
                        { 
                          action: "Level up to Level 3", 
                          description: "Unlocked new benefits", 
                          time: "2 weeks ago",
                          type: "level" 
                        }
                      ].map((activity, index) => (
                        <HStack 
                          key={index} 
                          p={4} 
                          bg="gray.50" 
                          borderRadius="md"
                          justify="space-between"
                        >
                          <HStack spacing={3}>
                            <Box
                              w="40px"
                              h="40px"
                              borderRadius="full"
                              bg={
                                activity.type === 'earn' ? 'green.100' : 
                                activity.type === 'campaign' ? 'purple.100' : 
                                activity.type === 'auction' ? 'blue.100' :
                                activity.type === 'level' ? 'yellow.100' :
                                activity.type === 'star' ? 'orange.100' :
                                activity.type === 'badge' ? 'teal.100' :
                                'gray.100'
                              }
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <SafeIcon 
                                icon={
                                  activity.type === 'earn' ? FiAward : 
                                  activity.type === 'campaign' ? FiTarget : 
                                  activity.type === 'auction' ? FiTrendingUp :
                                  activity.type === 'level' ? FiTrophy :
                                  activity.type === 'star' ? FiStar :
                                  activity.type === 'badge' ? FiAward :
                                  FiUser
                                } 
                                className={`${
                                  activity.type === 'earn' ? 'text-green-500' : 
                                  activity.type === 'campaign' ? 'text-purple-500' : 
                                  activity.type === 'auction' ? 'text-blue-500' :
                                  activity.type === 'level' ? 'text-yellow-500' :
                                  activity.type === 'star' ? 'text-orange-500 fill-current' :
                                  activity.type === 'badge' ? 'text-teal-500 fill-current' :
                                  'text-gray-500'
                                }`}
                              />
                            </Box>
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="medium">{activity.action}</Text>
                              <Text fontSize="sm" color="gray.600">{activity.description}</Text>
                            </VStack>
                          </HStack>
                          <Text fontSize="sm" color="gray.500">{activity.time}</Text>
                        </HStack>
                      ))}
                    </VStack>
                  </VStack>
                </Box>
              </VStack>
            </TabPanel>
            
            <TabPanel p={0} id="stars-tab">
              <StarAchievements userId={user.id} />
            </TabPanel>
            
            <TabPanel p={0} id="badges-tab">
              <BadgeGallery userId={user.id} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>

      {/* Level Up Modal */}
      {levelUpInfo && (
        <LevelUpModal 
          isOpen={isLevelUpOpen} 
          onClose={onLevelUpClose}
          newLevel={levelUpInfo.newLevel}
          previousLevel={levelUpInfo.previousLevel}
        />
      )}
      
      {/* Badge Award Modal */}
      {selectedBadge && (
        <BadgeAwardModal 
          isOpen={isBadgeOpen} 
          onClose={onBadgeClose}
          badge={selectedBadge}
          pointsEarned={50}
        />
      )}
    </Box>
  );
};

export default Profile;