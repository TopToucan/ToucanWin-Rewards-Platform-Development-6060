import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Badge,
  useToast,
  SimpleGrid,
  Divider,
  useClipboard
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiGift, FiCopy, FiCheck, FiCalendar, FiPercent } = FiIcons;

const MotionBox = motion(Box);

const CouponCard = ({ coupon, onRedeem }) => {
  const { hasCopied, onCopy } = useClipboard(coupon.code);
  const isExpired = new Date(coupon.expiryDate) < new Date();

  return (
    <MotionBox
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      bg="white"
      p={6}
      borderRadius="xl"
      shadow="md"
      border="1px solid"
      borderColor="gray.100"
      position="relative"
      overflow="hidden"
    >
      {/* Discount Badge */}
      <Badge
        position="absolute"
        top={4}
        right={4}
        colorScheme={isExpired ? "gray" : "green"}
        fontSize="sm"
        px={3}
        py={1}
        borderRadius="full"
      >
        {coupon.discount}% OFF
      </Badge>

      <VStack align="start" spacing={4}>
        <HStack>
          <SafeIcon icon={FiGift} className="text-2xl text-teal-500" />
          <Heading size="md" color={isExpired ? "gray.400" : "gray.700"}>
            {coupon.name}
          </Heading>
        </HStack>

        <Text color={isExpired ? "gray.400" : "gray.600"} fontSize="sm">
          {coupon.description}
        </Text>

        <Box
          bg="gray.50"
          p={3}
          borderRadius="md"
          w="full"
        >
          <HStack justify="space-between">
            <Text
              fontFamily="monospace"
              fontWeight="bold"
              fontSize="lg"
              color={isExpired ? "gray.400" : "teal.600"}
            >
              {coupon.code}
            </Text>
            <Button
              size="sm"
              leftIcon={<SafeIcon icon={hasCopied ? FiCheck : FiCopy} />}
              onClick={onCopy}
              isDisabled={isExpired}
            >
              {hasCopied ? "Copied!" : "Copy"}
            </Button>
          </HStack>
        </Box>

        <HStack justify="space-between" w="full" fontSize="sm" color="gray.500">
          <HStack>
            <SafeIcon icon={FiCalendar} />
            <Text>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</Text>
          </HStack>
          <Badge colorScheme={isExpired ? "red" : "green"}>
            {isExpired ? "Expired" : "Active"}
          </Badge>
        </HStack>

        <Button
          w="full"
          colorScheme="teal"
          onClick={() => onRedeem(coupon)}
          isDisabled={isExpired}
        >
          Redeem Now
        </Button>
      </VStack>
    </MotionBox>
  );
};

const CouponSystem = () => {
  const [couponCode, setCouponCode] = useState('');
  const toast = useToast();

  const coupons = [
    {
      id: 1,
      name: "Welcome Bonus",
      code: "WELCOME25",
      discount: 25,
      description: "Get 25% off on your first purchase",
      expiryDate: "2024-12-31",
      minimumPurchase: 100
    },
    {
      id: 2,
      name: "Summer Sale",
      code: "SUMMER20",
      discount: 20,
      description: "Summer special discount on all items",
      expiryDate: "2024-06-30",
      minimumPurchase: 50
    },
    {
      id: 3,
      name: "Flash Deal",
      code: "FLASH15",
      discount: 15,
      description: "Limited time offer for premium members",
      expiryDate: "2024-04-01",
      minimumPurchase: 75
    },
    {
      id: 4,
      name: "Special Discount",
      code: "SPECIAL30",
      discount: 30,
      description: "Exclusive discount for loyal customers",
      expiryDate: "2024-05-15",
      minimumPurchase: 150
    }
  ];

  const handleApplyCoupon = () => {
    const coupon = coupons.find(c => c.code === couponCode.toUpperCase());
    if (!coupon) {
      toast({
        title: "Invalid Coupon",
        description: "Please enter a valid coupon code",
        status: "error",
        duration: 3000,
        isClosable: true
      });
      return;
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      toast({
        title: "Expired Coupon",
        description: "This coupon has expired",
        status: "error",
        duration: 3000,
        isClosable: true
      });
      return;
    }

    toast({
      title: "Coupon Applied!",
      description: `You've received ${coupon.discount}% discount`,
      status: "success",
      duration: 3000,
      isClosable: true
    });
    setCouponCode('');
  };

  const handleRedeem = (coupon) => {
    toast({
      title: "Coupon Redeemed!",
      description: `You've redeemed ${coupon.name}. The discount will be applied at checkout.`,
      status: "success",
      duration: 3000,
      isClosable: true
    });
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box bg="teal.500" color="white" py={10} mb={10}>
        <Container maxW="container.xl">
          <VStack spacing={4} align="center" textAlign="center">
            <SafeIcon icon={FiPercent} className="text-5xl" />
            <Heading size="xl">Special Offers & Coupons</Heading>
            <Text fontSize="lg" maxW="600px">
              Discover exclusive discounts and save big on your purchases
            </Text>
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.xl" pb={16}>
        <VStack spacing={10}>
          {/* Coupon Input Section */}
          <Box bg="white" p={6} borderRadius="xl" shadow="md" w="full" maxW="600px">
            <VStack spacing={4}>
              <Heading size="md">Have a Coupon Code?</Heading>
              <HStack w="full">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  textTransform="uppercase"
                />
                <Button
                  colorScheme="teal"
                  onClick={handleApplyCoupon}
                  isDisabled={!couponCode}
                >
                  Apply
                </Button>
              </HStack>
            </VStack>
          </Box>

          <Divider />

          {/* Available Coupons */}
          <VStack spacing={4} w="full">
            <Heading size="lg">Available Coupons</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
              {coupons.map((coupon) => (
                <CouponCard
                  key={coupon.id}
                  coupon={coupon}
                  onRedeem={handleRedeem}
                />
              ))}
            </SimpleGrid>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default CouponSystem;