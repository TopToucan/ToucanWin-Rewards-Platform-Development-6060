import React, { useState, useEffect } from 'react';
import { 
  Box, 
  SimpleGrid, 
  Text, 
  Image, 
  VStack, 
  HStack, 
  Badge, 
  Button, 
  Input, 
  InputGroup, 
  InputRightElement,
  useColorModeValue, 
  useToast,
  Heading,
  CircularProgress,
  CircularProgressLabel
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiClock, FiTrendingUp, FiDollarSign } = FiIcons;

const MotionBox = motion(Box);

const AuctionCountdown = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [progress, setProgress] = useState(100);
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = endTime - now;
      
      if (difference <= 0) {
        setTimeLeft('Ended');
        return;
      }
      
      // Calculate total seconds for the auction (assuming 24 hours max)
      const totalDuration = 24 * 60 * 60 * 1000;
      const elapsed = totalDuration - Math.min(difference, totalDuration);
      const progressValue = 100 - Math.floor((elapsed / totalDuration) * 100);
      setProgress(progressValue);
      
      // Format the time
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [endTime]);
  
  let progressColor = 'green.500';
  if (progress < 50) progressColor = 'yellow.500';
  if (progress < 20) progressColor = 'red.500';
  
  return (
    <HStack>
      <CircularProgress 
        value={progress} 
        color={progressColor} 
        size="40px" 
        thickness="8px"
      >
        <CircularProgressLabel>
          <SafeIcon icon={FiClock} className="text-sm" />
        </CircularProgressLabel>
      </CircularProgress>
      <Text fontWeight="medium" fontSize="sm">{timeLeft}</Text>
    </HStack>
  );
};

const AuctionCard = ({ auction, userPoints }) => {
  const [bidAmount, setBidAmount] = useState(auction.currentBid + 10);
  const [currentBid, setCurrentBid] = useState(auction.currentBid);
  const [isMyBid, setIsMyBid] = useState(false);
  const toast = useToast();
  
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  const handleBidChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setBidAmount(value);
    }
  };
  
  const placeBid = () => {
    if (bidAmount <= currentBid) {
      toast({
        title: "Bid too low",
        description: "Your bid must be higher than the current bid",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (bidAmount > userPoints) {
      toast({
        title: "Insufficient points",
        description: "You don't have enough points for this bid",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Place the bid
    setCurrentBid(bidAmount);
    setIsMyBid(true);
    
    toast({
      title: "Bid placed!",
      description: `You've successfully bid ${bidAmount} points on ${auction.name}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  
  return (
    <MotionBox
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      bg={cardBg}
      borderRadius="xl"
      overflow="hidden"
      shadow="md"
      border="1px solid"
      borderColor={borderColor}
    >
      {/* Image */}
      <Box position="relative" h="180px">
        <Image
          src={auction.image}
          alt={auction.name}
          w="full"
          h="full"
          objectFit="cover"
          transition="transform 0.3s"
          _hover={{ transform: "scale(1.05)" }}
        />
        <Badge
          position="absolute"
          top={3}
          right={3}
          colorScheme="red"
          variant="solid"
          px={2}
          py={1}
        >
          LIVE
        </Badge>
      </Box>
      
      {/* Content */}
      <VStack p={4} spacing={3} align="stretch">
        <HStack justify="space-between">
          <Heading size="md" noOfLines={1}>{auction.name}</Heading>
          <AuctionCountdown endTime={auction.endTime} />
        </HStack>
        
        {/* Current Bid */}
        <Box p={3} bg="teal.50" borderRadius="md">
          <HStack justify="space-between">
            <HStack>
              <SafeIcon icon={FiDollarSign} className="text-teal-600" />
              <Text fontWeight="medium" color="gray.700">Current Bid</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold" fontSize="xl" color="teal.600">
                {currentBid}
              </Text>
              <Text fontSize="sm" color="gray.500">points</Text>
            </HStack>
          </HStack>
          {isMyBid && (
            <Badge colorScheme="green" mt={1} size="sm">
              You're the highest bidder!
            </Badge>
          )}
        </Box>
        
        {/* Bid Form */}
        <HStack>
          <InputGroup size="md">
            <Input
              type="number"
              placeholder={`Min: ${currentBid + 1}`}
              value={bidAmount}
              onChange={handleBidChange}
              min={currentBid + 1}
            />
            <InputRightElement width="4.5rem">
              <Text fontSize="xs" color="gray.500">points</Text>
            </InputRightElement>
          </InputGroup>
          <Button
            colorScheme="teal"
            leftIcon={<SafeIcon icon={FiTrendingUp} />}
            onClick={placeBid}
            isDisabled={bidAmount <= currentBid || bidAmount > userPoints}
          >
            Bid
          </Button>
        </HStack>
        
        {/* Min Bid Info */}
        <HStack justify="space-between" fontSize="xs" color="gray.500">
          <Text>Min increment: 1 point</Text>
          <Text>Your points: {userPoints}</Text>
        </HStack>
      </VStack>
    </MotionBox>
  );
};

const LiveAuctions = ({ auctions, userPoints }) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
      {auctions.map((auction) => (
        <AuctionCard 
          key={auction.id} 
          auction={auction} 
          userPoints={userPoints} 
        />
      ))}
    </SimpleGrid>
  );
};

export default LiveAuctions;