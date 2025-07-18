import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Input,
  Image,
  useColorModeValue,
  Flex,
  CircularProgress,
  CircularProgressLabel,
  useToast,
  InputGroup,
  InputRightElement,
  Stack,
  Alert,
  AlertIcon,
  SimpleGrid
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { AuctionController } from '../controllers/AuctionController';
import { UserController } from '../controllers/UserController';

const { FiClock, FiTrendingUp, FiAward, FiDollarSign } = FiIcons;

const MotionBox = motion(Box);

const AuctionCard = ({ auction, onBid, bidAmount, onBidChange, user }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardBg = useColorModeValue('white', 'gray.700');
  const toast = useToast();

  // Calculate time percentage for visual timer
  const timeLeftParts = auction.timeLeft.split(' ');
  let timePercentage = 0;
  if (timeLeftParts.includes('d')) {
    timePercentage = 75;
  } else if (timeLeftParts.includes('h')) {
    const hours = parseInt(timeLeftParts[0]);
    timePercentage = Math.max(10, Math.min(60, hours * 5));
  } else {
    timePercentage = 10;
  }

  const handleBidSubmit = () => {
    if (bidAmount && bidAmount > auction.currentBid) {
      if (user && bidAmount > user.points) {
        toast({
          title: "Insufficient Points!",
          description: `You need ${bidAmount} points but only have ${user.points} points.`,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        return;
      }
      
      onBid(auction.id);
      
      toast({
        title: "Bid Placed Successfully!",
        description: `${user?.name || 'You'} placed a bid of ${bidAmount} points on ${auction.item}.`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const canBid = user && bidAmount && bidAmount > auction.currentBid && bidAmount <= user.points;

  return (
    <MotionBox
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      bg={cardBg}
      borderRadius="xl"
      shadow="md"
      overflow="hidden"
      _hover={{ shadow: 'lg' }}
      border="1px solid"
      borderColor="gray.100"
    >
      {/* Image Section */}
      <Box h={{ base: "180px", md: "200px" }} position="relative" overflow="hidden">
        <Image
          src={`https://images.unsplash.com/photo-${1560000000000 + auction.id * 10000}?auto=format&fit=crop&q=80&w=400`}
          alt={auction.item}
          width="100%"
          height="100%"
          objectFit="cover"
          transition="transform 0.3s"
          _hover={{ transform: "scale(1.05)" }}
        />
        
        {/* Live Badge */}
        <Badge
          position="absolute"
          top={{ base: 2, md: 3 }}
          right={{ base: 2, md: 3 }}
          colorScheme="red"
          px={{ base: 2, md: 3 }}
          py={1}
          borderRadius="full"
          fontWeight="bold"
          fontSize={{ base: "xs", md: "sm" }}
        >
          LIVE
        </Badge>
        
        {/* Timer */}
        <Box
          position="absolute"
          top={{ base: 2, md: 3 }}
          left={{ base: 2, md: 3 }}
        >
          <CircularProgress
            value={timePercentage}
            color="teal.500"
            size={{ base: "40px", md: "50px" }}
            thickness="10px"
            trackColor="whiteAlpha.700"
          >
            <CircularProgressLabel fontSize={{ base: "xs", md: "sm" }}>
              <SafeIcon icon={FiClock} />
            </CircularProgressLabel>
          </CircularProgress>
        </Box>
      </Box>

      {/* Content Section */}
      <Box p={{ base: 4, md: 6 }}>
        <VStack spacing={{ base: 3, md: 4 }} align="stretch">
          {/* Title and Time */}
          <VStack spacing={2} align="start">
            <Heading
              size={{ base: "sm", md: "md" }}
              color="gray.800"
              noOfLines={2}
              lineHeight="shorter"
            >
              {auction.item}
            </Heading>
            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">
              Time left: <Text as="span" fontWeight="bold" color="teal.500">{auction.timeLeft}</Text>
            </Text>
          </VStack>

          {/* Current Bid */}
          <Box p={{ base: 3, md: 4 }} bg="teal.50" borderRadius="lg" w="full">
            <HStack justify="space-between" align="center">
              <HStack spacing={2}>
                <SafeIcon icon={FiAward} className="text-teal-500" />
                <Text
                  fontWeight="bold"
                  color="gray.700"
                  fontSize={{ base: "sm", md: "md" }}
                >
                  Current Bid
                </Text>
              </HStack>
              <Text
                fontWeight="bold"
                color="teal.500"
                fontSize={{ base: "lg", md: "xl" }}
              >
                {auction.currentBid}
              </Text>
            </HStack>
          </Box>

          {/* User Points Display */}
          {user && (
            <Alert status="info" borderRadius="md" py={2}>
              <AlertIcon />
              <Text fontSize="sm">
                Your available points: <strong>{user.points}</strong>
              </Text>
            </Alert>
          )}

          {/* Bidding Section */}
          <VStack spacing={3} w="full">
            <InputGroup size={{ base: "sm", md: "md" }}>
              <Input
                placeholder={`Min: ${auction.currentBid + 1} points`}
                type="number"
                value={bidAmount || ''}
                onChange={(e) => onBidChange(auction.id, e.target.value)}
                min={auction.currentBid + 1}
                max={user?.points || 999999}
                bg="white"
                borderColor="gray.300"
                _focus={{
                  borderColor: "teal.500",
                  boxShadow: "0 0 0 1px #06d79c"
                }}
                fontSize={{ base: "sm", md: "md" }}
              />
              <InputRightElement width="4rem">
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">
                  pts
                </Text>
              </InputRightElement>
            </InputGroup>

            <Stack
              direction={{ base: "column", sm: "row" }}
              spacing={2}
              w="full"
            >
              <Button
                size={{ base: "sm", md: "md" }}
                colorScheme="teal"
                leftIcon={<SafeIcon icon={FiTrendingUp} />}
                onClick={handleBidSubmit}
                isDisabled={!canBid}
                flex="1"
                fontSize={{ base: "sm", md: "md" }}
                py={{ base: 5, md: 6 }}
                _hover={canBid ? {
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg'
                } : {}}
                fontWeight="semibold"
                aria-label={
                  !user ? 'Login to bid' : 
                  !bidAmount ? 'Enter bid amount' :
                  bidAmount <= auction.currentBid ? 'Bid amount too low' :
                  bidAmount > user.points ? 'Insufficient points' :
                  'Place bid now'
                }
              >
                {!user ? 'Login to Bid' : 
                 !bidAmount ? 'Enter Bid Amount' :
                 bidAmount <= auction.currentBid ? 'Bid Too Low' :
                 bidAmount > user.points ? 'Insufficient Points' :
                 'Place Bid Now'}
              </Button>
              
              <Button
                size={{ base: "sm", md: "md" }}
                variant="outline"
                colorScheme="teal"
                onClick={() => setIsExpanded(!isExpanded)}
                flex={{ base: "1", sm: "auto" }}
                fontSize={{ base: "sm", md: "md" }}
                py={{ base: 5, md: 6 }}
                aria-expanded={isExpanded}
                aria-controls={`details-${auction.id}`}
              >
                {isExpanded ? 'Less' : 'Details'}
              </Button>
            </Stack>
          </VStack>

          {/* Expanded Details */}
          {isExpanded && (
            <MotionBox
              id={`details-${auction.id}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              bg="gray.50"
              p={{ base: 3, md: 4 }}
              borderRadius="md"
              mt={2}
            >
              <VStack spacing={2} align="start" fontSize={{ base: "xs", md: "sm" }}>
                <Text color="gray.600">
                  <Text as="span" fontWeight="semibold">Min Increment:</Text> {auction.minBidIncrement} points
                </Text>
                <Text color="gray.600">
                  <Text as="span" fontWeight="semibold">Status:</Text> {auction.status}
                </Text>
                {user && (
                  <Text color="gray.600">
                    <Text as="span" fontWeight="semibold">Your Points:</Text> {user.points}
                  </Text>
                )}
              </VStack>
            </MotionBox>
          )}
        </VStack>
      </Box>
    </MotionBox>
  );
};

const Auctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [bidAmounts, setBidAmounts] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = UserController.getUser();
    setUser(userData);

    const auctionData = AuctionController.getAuctions();
    const extendedAuctions = [
      ...auctionData,
      {
        id: 4,
        item: "Luxury Coffee Machine",
        currentBid: 1200,
        timeLeft: "8h 45m",
        status: "active",
        minBidIncrement: 20
      },
      {
        id: 5,
        item: "Weekend Getaway Package",
        currentBid: 2000,
        timeLeft: "1d 12h",
        status: "active",
        minBidIncrement: 50
      },
      {
        id: 6,
        item: "Designer Sunglasses",
        currentBid: 600,
        timeLeft: "4h 10m",
        status: "active",
        minBidIncrement: 10
      }
    ];
    setAuctions(extendedAuctions);
  }, []);

  const handleBidChange = (auctionId, value) => {
    setBidAmounts(prev => ({ ...prev, [auctionId]: value }));
  };

  const handlePlaceBid = (auctionId) => {
    const bidAmount = bidAmounts[auctionId];
    
    setAuctions(prevAuctions =>
      prevAuctions.map(auction =>
        auction.id === auctionId ? { ...auction, currentBid: parseInt(bidAmount) } : auction
      )
    );
    
    setBidAmounts(prev => ({ ...prev, [auctionId]: '' }));
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        bgGradient="linear(to-r, teal.500, teal.400)" 
        color="white" 
        py={{ base: 8, md: 12 }} 
        mb={{ base: 6, md: 10 }}
      >
        <Container maxW="container.xl" px={{ base: 4, md: 8 }}>
          <Stack 
            direction={{ base: "column", md: "row" }} 
            spacing={{ base: 6, md: 10 }} 
            align="center"
            textAlign={{ base: "center", md: "left" }}
          >
            <VStack 
              align={{ base: "center", md: "start" }} 
              spacing={{ base: 3, md: 4 }} 
              flex="1"
            >
              <Badge 
                colorScheme="red" 
                fontSize={{ base: "sm", md: "md" }} 
                px={{ base: 3, md: 4 }} 
                py={1} 
                borderRadius="full"
              >
                LIVE NOW
              </Badge>
              <Heading as="h1" size={{ base: "lg", md: "xl" }} lineHeight="shorter">
                {user ? `${user.name}, ` : ''}Live Auctions
              </Heading>
              <Text 
                fontSize={{ base: "md", md: "lg" }} 
                opacity={0.9} 
                maxW="400px" 
                lineHeight="relaxed"
              >
                {user ? `You have ${user.points} points to bid with! ` : ''}
                Bid your points on exclusive items and experiences!
              </Text>
            </VStack>

            <Flex justify={{ base: "center", md: "flex-end" }} flex={{ base: "none", md: "1" }}>
              <MotionBox 
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0]
                }} 
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatType: "reverse" 
                }}
              >
                <SafeIcon icon={FiAward} className="text-6xl md:text-8xl text-white opacity-90" />
              </MotionBox>
            </Flex>
          </Stack>
        </Container>
      </Box>

      {/* Auctions Grid */}
      <Container maxW="container.xl" pb={{ base: 12, md: 16 }} px={{ base: 4, md: 8 }}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {auctions.map((auction) => (
            <AuctionCard
              key={auction.id}
              auction={auction}
              bidAmount={bidAmounts[auction.id]}
              onBidChange={handleBidChange}
              onBid={handlePlaceBid}
              user={user}
            />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Auctions;