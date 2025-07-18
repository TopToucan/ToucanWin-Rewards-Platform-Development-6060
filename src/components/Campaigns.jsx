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
  useColorModeValue,
  Flex,
  Progress,
  Stack,
  useToast,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import * as FiIcons from 'react-icons/fi';
import { CampaignController } from '../controllers/CampaignController';
import { UserController } from '../controllers/UserController';
import SafeIcon from '../common/SafeIcon';
import LazyImage from './LazyImage';

const { FiClock, FiUsers, FiAward, FiCalendar, FiSearch, FiFilter } = FiIcons;

const MotionBox = motion(Box);

const CampaignCard = ({ campaign, onJoin, user }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardHoverBg = useColorModeValue('gray.50', 'gray.600');
  const toast = useToast();

  // Calculate random progress value for visual appeal
  const progress = Math.floor(Math.random() * 70) + 20; // Between 20-90%

  const handleJoin = () => {
    onJoin(campaign.id);
    toast({
      title: "Campaign Joined Successfully!",
      description: `Welcome to "${campaign.name}", ${user?.name || 'User'}! Start earning bonus points now.`,
      status: "success",
      duration: 4000,
      isClosable: true,
    });
  };

  // Generate optimized campaign image URL
  const campaignImageUrl = `https://images.unsplash.com/photo-${1550000000000 + campaign.id * 10000}?auto=format&fit=crop&q=80&w=400`;

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
      _hover={{ shadow: 'lg', bg: cardHoverBg }}
      borderTop="4px solid"
      borderTopColor="teal.500"
    >
      {/* Header Section with Optimized Image */}
      <Box h={{ base: "100px", md: "120px" }} position="relative" overflow="hidden">
        <LazyImage
          src={campaignImageUrl}
          alt={`${campaign.name} campaign banner`}
          width={400}
          height={120}
          sizes={[400, 800]}
          breakpoints={{ sm: '400px', md: '800px' }}
          fallbackSrc="https://via.placeholder.com/400x120/38B2AC/FFFFFF?text=Campaign"
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          objectFit="cover"
          opacity="0.3"
          loading="lazy"
        />
        <Flex
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          align="center"
          justify="center"
          bg="teal.50"
        >
          <SafeIcon
            icon={campaign.id % 3 === 0 ? FiAward : campaign.id % 2 === 0 ? FiUsers : FiClock}
            className="text-4xl md:text-5xl text-teal-500 opacity-80"
          />
        </Flex>
      </Box>

      {/* Content Section */}
      <Box p={{ base: 4, md: 6 }}>
        <VStack align="start" spacing={{ base: 3, md: 4 }}>
          {/* Badges */}
          <Stack
            direction={{ base: "column", sm: "row" }}
            spacing={2}
            w="full"
            align={{ base: "start", sm: "center" }}
          >
            <Badge
              colorScheme="teal"
              fontSize={{ base: "xs", md: "sm" }}
              px={{ base: 2, md: 3 }}
              py={1}
              borderRadius="full"
            >
              {campaign.points} points
            </Badge>
            <Badge
              colorScheme={campaign.status === 'Active' ? 'green' : 'purple'}
              fontSize={{ base: "xs", md: "sm" }}
              px={{ base: 2, md: 3 }}
              py={1}
              borderRadius="full"
            >
              {campaign.status}
            </Badge>
            <Badge
              colorScheme="blue"
              fontSize={{ base: "xs", md: "sm" }}
              px={{ base: 2, md: 3 }}
              py={1}
              borderRadius="full"
            >
              {campaign.category || 'General'}
            </Badge>
          </Stack>

          {/* Title */}
          <Heading
            as="h3"
            size={{ base: "sm", md: "md" }}
            color="gray.800"
            lineHeight="shorter"
            noOfLines={2}
          >
            {campaign.name}
          </Heading>

          {/* Description */}
          <Text
            fontSize={{ base: "sm", md: "md" }}
            color="gray.600"
            lineHeight="relaxed"
            noOfLines={{ base: 3, md: 2 }}
          >
            {campaign.description}
          </Text>

          {/* Progress Section */}
          <Box w="100%">
            <HStack justify="space-between" mb={2}>
              <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">
                Campaign Progress
              </Text>
              <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="teal.500">
                {progress}%
              </Text>
            </HStack>
            <Progress
              value={progress}
              size="sm"
              colorScheme="teal"
              borderRadius="full"
              bg="gray.100"
            />
          </Box>

          {/* Footer */}
          <Stack
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            w="100%"
            spacing={3}
            align={{ base: "stretch", sm: "center" }}
          >
            <HStack spacing={2} color="gray.500">
              <SafeIcon icon={FiCalendar} className="text-sm" />
              <Text fontSize={{ base: "xs", md: "sm" }}>
                Ends {campaign.endDate}
              </Text>
            </HStack>
            <Button
              size={{ base: "sm", md: "md" }}
              colorScheme="teal"
              onClick={handleJoin}
              leftIcon={<SafeIcon icon={FiAward} />}
              _hover={{ bg: 'teal.600', transform: 'translateY(-2px)' }}
              px={{ base: 4, md: 6 }}
              py={{ base: 4, md: 5 }}
              fontSize={{ base: "sm", md: "md" }}
              minW={{ base: "full", sm: "auto" }}
              fontWeight="semibold"
            >
              Join Campaign Now
            </Button>
          </Stack>
        </VStack>
      </Box>
    </MotionBox>
  );
};

const FilterCard = ({ title, children }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  
  return (
    <Box bg={cardBg} p={4} borderRadius="lg" shadow="sm">
      <VStack spacing={3} align="stretch">
        <Text fontWeight="semibold" fontSize="sm" color="gray.700">
          {title}
        </Text>
        {children}
      </VStack>
    </Box>
  );
};

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    search: '',
    pointsRange: [0, 1000]
  });

  useEffect(() => {
    const userData = UserController.getUser();
    setUser(userData);

    const campaignData = CampaignController.getCampaigns();
    // Add more campaigns with categories for filtering
    const extendedCampaigns = [
      ...campaignData.map(c => ({ ...c, category: c.category || 'General' })),
      {
        id: 4,
        name: "Weekend Flash Sale",
        points: 250,
        status: "Active",
        description: "Limited-time offers with bonus points on select products",
        endDate: "2024-07-15",
        category: "Shopping"
      },
      {
        id: 5,
        name: "Refer a Friend",
        points: 600,
        status: "Active",
        description: "Earn points when your referred friends make their first purchase",
        endDate: "2024-12-31",
        category: "Social"
      },
      {
        id: 6,
        name: "Anniversary Special",
        points: 1000,
        status: "Coming Soon",
        description: "Celebrate our anniversary with exclusive rewards and double points",
        endDate: "2024-10-01",
        category: "Special"
      },
      {
        id: 7,
        name: "Fitness Challenge",
        points: 400,
        status: "Active",
        description: "Track your fitness activities and earn points for staying healthy",
        endDate: "2024-08-30",
        category: "Health"
      },
      {
        id: 8,
        name: "Photo Contest",
        points: 300,
        status: "Active",
        description: "Share your best photos and win points in our monthly contest",
        endDate: "2024-07-31",
        category: "Creative"
      }
    ];
    setCampaigns(extendedCampaigns);
    setFilteredCampaigns(extendedCampaigns);
  }, []);

  // Filter campaigns based on current filters
  useEffect(() => {
    let filtered = campaigns.filter(campaign => {
      const matchesCategory = !filters.category || campaign.category === filters.category;
      const matchesStatus = !filters.status || campaign.status === filters.status;
      const matchesSearch = !filters.search || 
        campaign.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        campaign.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchesPoints = campaign.points >= filters.pointsRange[0] && campaign.points <= filters.pointsRange[1];
      
      return matchesCategory && matchesStatus && matchesSearch && matchesPoints;
    });
    
    setFilteredCampaigns(filtered);
  }, [campaigns, filters]);

  const handleJoinCampaign = (campaignId) => {
    console.log(`Joining campaign: ${campaignId}`);
  };

  const categories = [...new Set(campaigns.map(c => c.category))];
  const statuses = [...new Set(campaigns.map(c => c.status))];

  return (
    <Box>
      {/* Hero Section */}
      <Box bgGradient="linear(to-r, teal.500, teal.400)" color="white" py={{ base: 8, md: 12 }} mb={{ base: 6, md: 10 }}>
        <Container maxW="container.xl" px={{ base: 4, md: 8 }}>
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={{ base: 6, md: 10 }}
            align="center"
            textAlign={{ base: "center", md: "left" }}
          >
            <VStack align={{ base: "center", md: "start" }} spacing={{ base: 3, md: 4 }} flex="1">
              <Heading as="h1" size={{ base: "lg", md: "xl" }} lineHeight="shorter">
                {user ? `Welcome ${user.name}!` : 'Welcome!'} Join Active Campaigns
              </Heading>
              <Text fontSize={{ base: "md", md: "lg" }} opacity={0.9} maxW="500px" lineHeight="relaxed">
                {user ? `You have ${user.points} points.` : ''} Join our special campaigns to earn bonus points and unlock exclusive rewards.
              </Text>
            </VStack>
            <Flex justify={{ base: "center", md: "flex-end" }} flex={{ base: "none", md: "1" }}>
              <LazyImage
                src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1752867222479-blob"
                alt="ToucanWin Rewards Logo"
                width={100}
                height={100}
                sizes={[80, 100]}
                loading="eager"
                objectFit="contain"
              />
            </Flex>
          </Stack>
        </Container>
      </Box>

      <Container maxW="container.xl" pb={{ base: 12, md: 16 }} px={{ base: 4, md: 8 }}>
        <VStack spacing={8} align="stretch">
          {/* Filters Section with Swiper */}
          <Box>
            <HStack mb={4} spacing={2}>
              <SafeIcon icon={FiFilter} className="text-teal-500" />
              <Heading size="md" color="gray.800">Filter Campaigns</Heading>
            </HStack>
            
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView="auto"
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              breakpoints={{
                320: { slidesPerView: 1.2 },
                768: { slidesPerView: 2.5 },
                1024: { slidesPerView: 4 }
              }}
              style={{ paddingBottom: '40px' }}
            >
              <SwiperSlide style={{ width: 'auto', minWidth: '250px' }}>
                <FilterCard title="Search Campaigns">
                  <InputGroup>
                    <InputLeftElement>
                      <SafeIcon icon={FiSearch} className="text-gray-400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search campaigns..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                  </InputGroup>
                </FilterCard>
              </SwiperSlide>

              <SwiperSlide style={{ width: 'auto', minWidth: '200px' }}>
                <FilterCard title="Category">
                  <Select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Select>
                </FilterCard>
              </SwiperSlide>

              <SwiperSlide style={{ width: 'auto', minWidth: '200px' }}>
                <FilterCard title="Status">
                  <Select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="">All Status</option>
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </Select>
                </FilterCard>
              </SwiperSlide>

              <SwiperSlide style={{ width: 'auto', minWidth: '250px' }}>
                <FilterCard title="Points Range">
                  <VStack spacing={2}>
                    <HStack justify="space-between" w="full">
                      <Text fontSize="sm" color="gray.600">{filters.pointsRange[0]} pts</Text>
                      <Text fontSize="sm" color="gray.600">{filters.pointsRange[1]} pts</Text>
                    </HStack>
                    <RangeSlider
                      value={filters.pointsRange}
                      onChange={(val) => setFilters(prev => ({ ...prev, pointsRange: val }))}
                      min={0}
                      max={1000}
                      step={50}
                    >
                      <RangeSliderTrack>
                        <RangeSliderFilledTrack bg="teal.500" />
                      </RangeSliderTrack>
                      <RangeSliderThumb index={0} />
                      <RangeSliderThumb index={1} />
                    </RangeSlider>
                  </VStack>
                </FilterCard>
              </SwiperSlide>
            </Swiper>
          </Box>

          {/* Results Summary */}
          <HStack justify="space-between" align="center">
            <Text color="gray.600">
              Showing {filteredCampaigns.length} of {campaigns.length} campaigns
            </Text>
            <Button
              size="sm"
              variant="outline"
              colorScheme="teal"
              onClick={() => setFilters({ category: '', status: '', search: '', pointsRange: [0, 1000] })}
            >
              Clear Filters
            </Button>
          </HStack>

          {/* Campaigns Grid */}
          {filteredCampaigns.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, lg: 8 }}>
              {filteredCampaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onJoin={handleJoinCampaign}
                  user={user}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Box textAlign="center" py={12}>
              <VStack spacing={4}>
                <SafeIcon icon={FiSearch} className="text-4xl text-gray-400" />
                <Heading size="md" color="gray.600">No campaigns found</Heading>
                <Text color="gray.500">Try adjusting your filters to see more campaigns</Text>
                <Button
                  colorScheme="teal"
                  onClick={() => setFilters({ category: '', status: '', search: '', pointsRange: [0, 1000] })}
                >
                  Clear All Filters
                </Button>
              </VStack>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default Campaigns;