import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Button,
  Progress,
  Badge,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { MissionController } from '../controllers/MissionController';
import { UserController } from '../controllers/UserController';

const { 
  FiFlag, FiUpload, FiTrendingUp, FiUser, FiUserPlus, FiShoppingBag, 
  FiAward, FiCheckCircle, FiClock, FiStar
} = FiIcons;

const MotionBox = motion(Box);

const iconMap = {
  FiFlag,
  FiUpload,
  FiTrendingUp,
  FiUser,
  FiUserPlus,
  FiShoppingBag
};

const MissionCard = ({ mission, onComplete }) => {
  const progressPercentage = Math.min(Math.round((mission.progress / mission.target) * 100), 100);
  const toast = useToast();
  
  const handleComplete = () => {
    if (mission.completed) {
      toast({
        title: "Mission already completed",
        description: "You've already completed this mission.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // For demo purposes, we'll simulate completing the mission
    onComplete(mission.id);
  };

  // Get the icon component
  const IconComponent = iconMap[mission.icon] || FiFlag;
  
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      bg="white"
      p={6}
      borderRadius="xl"
      shadow="md"
      position="relative"
      borderTop="4px solid"
      borderTopColor={mission.completed ? "green.500" : "teal.500"}
    >
      {mission.completed && (
        <Badge
          position="absolute"
          top={3}
          right={3}
          colorScheme="green"
          fontSize="sm"
          px={2}
          py={1}
          borderRadius="full"
        >
          Completed
        </Badge>
      )}
      
      <VStack spacing={4} align="start">
        <Flex
          w="50px"
          h="50px"
          borderRadius="full"
          bg={mission.completed ? "green.100" : "teal.100"}
          color={mission.completed ? "green.500" : "teal.500"}
          justify="center"
          align="center"
        >
          <SafeIcon icon={IconComponent} className="text-xl" />
        </Flex>
        
        <Heading size="md" color={mission.completed ? "green.700" : "gray.700"}>
          {mission.title}
        </Heading>
        
        <Text fontSize="sm" color="gray.600" noOfLines={2}>
          {mission.description}
        </Text>
        
        <HStack w="full">
          <Badge colorScheme={mission.completed ? "green" : "teal"} fontSize="sm">
            {mission.points} points
          </Badge>
          
          <Text fontSize="xs" color="gray.500" ml="auto">
            Progress: {mission.progress}/{mission.target}
          </Text>
        </HStack>
        
        <Box w="100%">
          <Progress
            value={progressPercentage}
            size="sm"
            colorScheme={mission.completed ? "green" : "teal"}
            borderRadius="full"
          />
        </Box>
        
        <Button
          colorScheme={mission.completed ? "green" : "teal"}
          size="sm"
          width="full"
          leftIcon={<SafeIcon icon={mission.completed ? FiCheckCircle : FiFlag} />}
          onClick={handleComplete}
          isDisabled={mission.completed}
        >
          {mission.completed ? "Completed" : "Complete Mission"}
        </Button>
      </VStack>
    </MotionBox>
  );
};

const MissionsSummary = ({ summary }) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
      <Box bg="white" p={6} borderRadius="xl" shadow="md">
        <Stat>
          <StatLabel fontSize="sm" color="gray.500">Completed Missions</StatLabel>
          <HStack>
            <StatNumber fontSize="2xl" color="teal.500">{summary.completed}</StatNumber>
            <Text color="gray.500">/ {summary.total}</Text>
          </HStack>
          <StatHelpText>
            {summary.progress}% complete
          </StatHelpText>
        </Stat>
      </Box>
      
      <Box bg="white" p={6} borderRadius="xl" shadow="md">
        <Stat>
          <StatLabel fontSize="sm" color="gray.500">Points Earned</StatLabel>
          <HStack>
            <StatNumber fontSize="2xl" color="teal.500">{summary.earnedPoints}</StatNumber>
            <Text color="gray.500">/ {summary.totalPoints}</Text>
          </HStack>
          <StatHelpText>
            From completed missions
          </StatHelpText>
        </Stat>
      </Box>
      
      <Box bg="white" p={6} borderRadius="xl" shadow="md">
        <VStack spacing={2} align="start">
          <Text fontSize="sm" color="gray.500">Overall Progress</Text>
          <Progress
            value={summary.progress}
            size="lg"
            colorScheme="teal"
            borderRadius="full"
            w="100%"
          />
          <HStack w="100%" justify="space-between">
            <Text fontSize="xs" color="gray.500">0%</Text>
            <Text fontSize="xs" color="gray.500">100%</Text>
          </HStack>
        </VStack>
      </Box>
    </SimpleGrid>
  );
};

const Missions = () => {
  const [missions, setMissions] = useState([]);
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState({
    total: 0,
    completed: 0,
    progress: 0,
    totalPoints: 0,
    earnedPoints: 0
  });
  const toast = useToast();

  useEffect(() => {
    const userData = UserController.getUser();
    setUser(userData);
    
    const missionData = MissionController.getMissions();
    setMissions(missionData);
    
    const summaryData = MissionController.getMissionsSummary();
    setSummary(summaryData);
  }, []);

  const handleCompleteMission = (missionId) => {
    const result = MissionController.completeMission(missionId);
    
    if (result.success) {
      // Update missions state
      const updatedMissions = missions.map(mission => 
        mission.id === missionId 
          ? { ...mission, completed: true, progress: mission.target } 
          : mission
      );
      setMissions(updatedMissions);
      
      // Update user state
      if (user) {
        setUser({
          ...user,
          points: user.points + result.pointsEarned
        });
      }
      
      // Update summary
      setSummary({
        ...summary,
        completed: summary.completed + 1,
        progress: Math.round(((summary.completed + 1) / summary.total) * 100),
        earnedPoints: summary.earnedPoints + result.pointsEarned
      });
      
      // Show success message
      toast({
        title: "Mission Completed!",
        description: `You earned ${result.pointsEarned} points.`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      
      // Trigger confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };
  
  const beginnerMissions = missions.filter(mission => mission.category === 'beginner');
  const weeklyMissions = missions.filter(mission => mission.category === 'weekly');
  const regularMissions = missions.filter(mission => 
    mission.category !== 'beginner' && mission.category !== 'weekly'
  );

  return (
    <Box>
      {/* Hero Section */}
      <Box bgGradient="linear(to-r, teal.500, teal.400)" color="white" py={10} mb={8}>
        <Container maxW="container.xl">
          <VStack spacing={4} align="center" textAlign="center">
            <SafeIcon icon={FiStar} className="text-5xl" />
            <Heading as="h1" size="xl">Daily Missions</Heading>
            <Text fontSize="lg" maxW="600px">
              Complete missions to earn points and unlock exclusive rewards
            </Text>
            {user && (
              <Badge colorScheme="white" fontSize="md" px={3} py={1} borderRadius="full">
                Your Points: {user.points}
              </Badge>
            )}
          </VStack>
        </Container>
      </Box>
      
      <Container maxW="container.xl" pb={16}>
        <VStack spacing={10} align="stretch">
          {/* Mission Stats Summary */}
          <MissionsSummary summary={summary} />
          
          {/* Mission Categories */}
          <Tabs variant="soft-rounded" colorScheme="teal">
            <TabList mb={6}>
              <Tab>
                <HStack>
                  <SafeIcon icon={FiFlag} />
                  <Text>All Missions</Text>
                </HStack>
              </Tab>
              <Tab>
                <HStack>
                  <SafeIcon icon={FiAward} />
                  <Text>Beginner</Text>
                </HStack>
              </Tab>
              <Tab>
                <HStack>
                  <SafeIcon icon={FiClock} />
                  <Text>Weekly</Text>
                </HStack>
              </Tab>
            </TabList>
            
            <TabPanels>
              {/* All Missions */}
              <TabPanel p={0}>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  <AnimatePresence>
                    {missions.map(mission => (
                      <MissionCard 
                        key={mission.id} 
                        mission={mission} 
                        onComplete={handleCompleteMission} 
                      />
                    ))}
                  </AnimatePresence>
                </SimpleGrid>
              </TabPanel>
              
              {/* Beginner Missions */}
              <TabPanel p={0}>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  <AnimatePresence>
                    {beginnerMissions.map(mission => (
                      <MissionCard 
                        key={mission.id} 
                        mission={mission} 
                        onComplete={handleCompleteMission} 
                      />
                    ))}
                  </AnimatePresence>
                </SimpleGrid>
              </TabPanel>
              
              {/* Weekly Missions */}
              <TabPanel p={0}>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  <AnimatePresence>
                    {weeklyMissions.map(mission => (
                      <MissionCard 
                        key={mission.id} 
                        mission={mission} 
                        onComplete={handleCompleteMission} 
                      />
                    ))}
                  </AnimatePresence>
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
};

export default Missions;