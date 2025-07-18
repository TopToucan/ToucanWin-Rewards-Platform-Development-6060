import React from 'react';
import { Box, Container, Heading, Text, VStack, SimpleGrid, Button, useColorModeValue, Flex, Stack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import LazyImage from './LazyImage';
import { Link } from 'react-router-dom';

const { FiAward, FiGift, FiTarget, FiBarChart2, FiFlag, FiTrophy } = FiIcons;

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionButton = motion(Button);

const FeatureCard = ({ icon, title, description, delay, linkTo }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  
  return (
    <MotionBox
      as="article"
      role="article"
      aria-labelledby={`feature-${title.replace(/\s+/g, '-').toLowerCase()}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      bg={cardBg}
      p={{ base: 5, md: 6 }}
      borderRadius="xl"
      shadow="md"
      className="h-full"
      borderTop="4px solid"
      borderTopColor="teal.500"
      tabIndex={0}
      _focus={{
        outline: '2px solid',
        outlineColor: 'teal.500',
        outlineOffset: '2px'
      }}
      whileHover={{
        y: -8,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        transition: { duration: 0.3 }
      }}
      as={Link}
      to={linkTo}
      _hover={{ textDecoration: 'none' }}
    >
      <VStack spacing={{ base: 4, md: 5 }} align="start" h="full">
        <motion.div
          whileHover={{
            scale: 1.1,
            rotate: 5,
            transition: { duration: 0.3 }
          }}
          aria-hidden="true"
        >
          <Box
            p={{ base: 2, md: 3 }}
            bg="teal.50"
            borderRadius="full"
          >
            <SafeIcon icon={icon} className="text-xl md:text-2xl text-teal-500" />
          </Box>
        </motion.div>
        
        <Heading
          as="h3"
          id={`feature-${title.replace(/\s+/g, '-').toLowerCase()}`}
          size={{ base: "md", md: "md" }}
          color="gray.800"
          lineHeight="short"
        >
          {title}
        </Heading>
        
        <Text
          color="gray.600"
          fontSize={{ base: "sm", md: "md" }}
          flex="1"
        >
          {description}
        </Text>
      </VStack>
    </MotionBox>
  );
};

const MissionPreview = () => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const missions = [
    { title: "Join Your First Campaign", points: 50, progress: 0, target: 1, icon: FiFlag },
    { title: "Upload 3 Receipts", points: 100, progress: 1, target: 3, icon: FiAward },
    { title: "Place Your First Bid", points: 75, progress: 0, target: 1, icon: FiTarget }
  ];

  return (
    <Box as="section" py={10}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="start">
          <Stack
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            w="full"
            align={{ base: "start", md: "center" }}
          >
            <Heading as="h2" size="lg" color="gray.800">
              Daily Missions
            </Heading>
            <Button
              as={Link}
              to="/missions"
              colorScheme="teal"
              size={{ base: "md", md: "md" }}
              rightIcon={<SafeIcon icon={FiFlag} />}
            >
              View All Missions
            </Button>
          </Stack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
            {missions.map((mission, index) => {
              const progressPercentage = Math.round((mission.progress / mission.target) * 100);
              
              return (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  bg={cardBg}
                  p={5}
                  borderRadius="lg"
                  shadow="md"
                  borderLeft="4px solid"
                  borderLeftColor="teal.500"
                  as={Link}
                  to="/missions"
                  _hover={{ textDecoration: 'none', transform: 'translateY(-5px)' }}
                  transition="transform 0.3s ease"
                >
                  <VStack align="start" spacing={3}>
                    <HStack>
                      <Box color="teal.500">
                        <SafeIcon icon={mission.icon} className="text-xl" />
                      </Box>
                      <Text fontWeight="bold" noOfLines={1}>
                        {mission.title}
                      </Text>
                    </HStack>
                    
                    <Box w="100%" bg="gray.100" h="6px" borderRadius="full" overflow="hidden">
                      <Box
                        bg="teal.500"
                        h="100%"
                        w={`${progressPercentage}%`}
                        borderRadius="full"
                      />
                    </Box>
                    
                    <HStack justify="space-between" w="full">
                      <Text fontSize="sm" color="gray.600">
                        {mission.progress}/{mission.target} completed
                      </Text>
                      <Text fontWeight="bold" color="teal.600">
                        {mission.points} pts
                      </Text>
                    </HStack>
                  </VStack>
                </MotionBox>
              );
            })}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

const Home = () => {
  const features = [
    {
      icon: FiAward,
      title: "Earn Points",
      description: "Complete activities and shop to earn points that can be redeemed for rewards.",
      delay: 0.1,
      linkTo: "/rewards"
    },
    {
      icon: FiTarget,
      title: "Join Campaigns",
      description: "Participate in special campaigns to earn bonus points and exclusive rewards.",
      delay: 0.2,
      linkTo: "/campaigns"
    },
    {
      icon: FiTrophy,
      title: "Compete in Tournaments",
      description: "Join competitive tournaments and climb leaderboards to win amazing prizes.",
      delay: 0.3,
      linkTo: "/tournaments"
    },
    {
      icon: FiGift,
      title: "Win Auctions",
      description: "Bid your points on exciting auctions for premium products and experiences.",
      delay: 0.4,
      linkTo: "/auctions"
    },
    {
      icon: FiBarChart2,
      title: "Track Progress",
      description: "Monitor your point balance and achievement progress in real-time.",
      delay: 0.5,
      linkTo: "/profile"
    },
    {
      icon: FiFlag,
      title: "Complete Missions",
      description: "Take on daily and weekly missions to earn bonus points and unlock rewards.",
      delay: 0.6,
      linkTo: "/missions"
    }
  ];

  return (
    <Box as="main" role="main">
      {/* Hero Section */}
      <Box
        as="section"
        aria-labelledby="hero-heading"
        bgGradient="linear(to-r, teal.500, teal.400)"
        color="white"
        py={{ base: 12, md: 16, lg: 20 }}
        position="relative"
        overflow="hidden"
      >
        {/* Background Decorative Elements */}
        <MotionBox
          position="absolute"
          top={{ base: "5%", md: "10%" }}
          left={{ base: "2%", md: "5%" }}
          w={{ base: "150px", md: "200px", lg: "300px" }}
          h={{ base: "150px", md: "200px", lg: "300px" }}
          borderRadius="full"
          bg="whiteAlpha.100"
          aria-hidden="true"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        
        <MotionBox
          position="absolute"
          bottom={{ base: "2%", md: "5%" }}
          right={{ base: "5%", md: "10%" }}
          w={{ base: "100px", md: "150px", lg: "200px" }}
          h={{ base: "100px", md: "150px", lg: "200px" }}
          borderRadius="full"
          bg="whiteAlpha.100"
          aria-hidden="true"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        />

        <Container maxW="container.xl" position="relative" zIndex={1} px={{ base: 4, md: 8 }}>
          <Stack
            direction={{ base: "column", lg: "row" }}
            spacing={{ base: 8, lg: 10 }}
            align="center"
            textAlign={{ base: "center", lg: "left" }}
          >
            <MotionBox
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              flex="1"
            >
              <VStack spacing={{ base: 5, md: 6 }} align={{ base: "center", lg: "flex-start" }}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  <Heading
                    as="h1"
                    id="hero-heading"
                    size={{ base: "xl", md: "2xl" }}
                    fontWeight="bold"
                    lineHeight="shorter"
                    maxW={{ base: "full", lg: "600px" }}
                  >
                    Rewards That Make a Difference
                  </Heading>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                >
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    opacity={0.9}
                    maxW={{ base: "full", lg: "500px" }}
                    lineHeight="relaxed"
                  >
                    Join ToucanWin Rewards to earn points, unlock exclusive rewards, compete in tournaments, and participate in exciting auctions!
                  </Text>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                >
                  <MotionButton
                    size={{ base: "md", md: "lg" }}
                    bg="white"
                    color="teal.500"
                    leftIcon={<SafeIcon icon={FiAward} />}
                    px={{ base: 6, md: 8 }}
                    py={{ base: 6, md: 7 }}
                    fontSize={{ base: "sm", md: "md" }}
                    fontWeight="semibold"
                    aria-label="Start earning rewards now"
                    _focus={{
                      outline: '3px solid',
                      outlineColor: 'white',
                      outlineOffset: '2px'
                    }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                      y: -2
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    as={Link}
                    to="/auth"
                  >
                    Start Earning Now
                  </MotionButton>
                </motion.div>
              </VStack>
            </MotionBox>

            {/* Logo with Optimized Loading */}
            <MotionFlex
              justify="center"
              flex={{ base: "none", lg: "1" }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{
                  y: [20, -10, 20],
                }}
                transition={{
                  y: {
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut"
                  }
                }}
              >
                <LazyImage
                  src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1752868693247-blob"
                  alt="ToucanWin Rewards - Your gateway to earning points and exclusive rewards"
                  width={500}
                  height={400}
                  sizes={[250, 375, 500]}
                  breakpoints={{ sm: '250px', md: '375px', lg: '500px' }}
                  loading="eager"
                  objectFit="contain"
                  filter="drop-shadow(0px 15px 20px rgba(0,0,0,0.4))"
                />
              </motion.div>
            </MotionFlex>
          </Stack>
        </Container>
      </Box>

      {/* Missions Preview Section */}
      <MissionPreview />

      {/* Features Section */}
      <Box as="section" aria-labelledby="features-heading">
        <Container maxW="container.xl" py={{ base: 12, md: 16 }} px={{ base: 4, md: 8 }}>
          <VStack spacing={{ base: 12, md: 16 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <VStack spacing={{ base: 3, md: 4 }} textAlign="center">
                <Heading
                  as="h2"
                  id="features-heading"
                  size={{ base: "lg", md: "xl" }}
                  color="gray.800"
                  maxW="600px"
                  lineHeight="shorter"
                >
                  How It Works
                </Heading>
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  color="gray.600"
                  maxW="700px"
                  lineHeight="relaxed"
                  px={{ base: 4, md: 0 }}
                >
                  Our rewards program makes it easy to earn and redeem points through your everyday activities.
                </Text>
              </VStack>
            </motion.div>

            {/* Features Grid */}
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={{ base: 6, lg: 8 }}
              w="full"
            >
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </SimpleGrid>

            {/* Stats Section */}
            <MotionBox
              as="section"
              aria-labelledby="stats-heading"
              w="full"
              bg="teal.50"
              p={{ base: 6, md: 8, lg: 10 }}
              borderRadius="xl"
              mt={{ base: 8, md: 10 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <VStack spacing={6}>
                <Heading as="h2" id="stats-heading" size="lg" color="gray.800" textAlign="center">
                  Our Community Impact
                </Heading>
                
                <SimpleGrid
                  columns={{ base: 2, md: 4 }}
                  spacing={{ base: 6, md: 10 }}
                  w="full"
                >
                  {[
                    { label: "Active Users", value: "10K+" },
                    { label: "Points Awarded", value: "1.2M+" },
                    { label: "Tournaments", value: "24+" },
                    { label: "Rewards Claimed", value: "5.3K+" }
                  ].map((stat, index) => (
                    <MotionBox
                      key={index}
                      as="div"
                      role="img"
                      aria-label={`${stat.value} ${stat.label}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + (0.1 * index) }}
                      textAlign="center"
                      tabIndex={0}
                      _focus={{
                        outline: '2px solid',
                        outlineColor: 'teal.500',
                        outlineOffset: '2px',
                        borderRadius: 'md'
                      }}
                      whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.7 + (0.1 * index) }}
                      >
                        <Text
                          fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                          fontWeight="bold"
                          color="teal.500"
                          lineHeight="1"
                        >
                          {stat.value}
                        </Text>
                      </motion.div>
                      <Text
                        color="gray.600"
                        fontSize={{ base: "sm", md: "md" }}
                        mt={{ base: 1, md: 2 }}
                      >
                        {stat.label}
                      </Text>
                    </MotionBox>
                  ))}
                </SimpleGrid>
              </VStack>
            </MotionBox>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;