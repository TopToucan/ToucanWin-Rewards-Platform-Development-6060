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
  Select,
  FormControl,
  FormLabel,
  useToast,
  Divider,
  Badge
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiLock, FiCreditCard, FiGift } = FiIcons;
const MotionBox = motion(Box);

const Checkout = () => {
  const toast = useToast();
  const [points, setPoints] = useState(500);
  const [paymentMethod, setPaymentMethod] = useState('points');
  const [promoCode, setPromoCode] = useState('');

  const handleCheckout = () => {
    toast({
      title: "Order Placed Successfully!",
      description: "You will receive a confirmation email shortly.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handlePromoCode = () => {
    if (promoCode.toLowerCase() === 'save10') {
      setPoints(prevPoints => Math.floor(prevPoints * 0.9));
      toast({
        title: "Promo Code Applied!",
        description: "10% discount has been applied to your order.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Invalid Promo Code",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" p={8}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack spacing={8} align="stretch">
          <Heading size="xl" color="teal.600">Checkout</Heading>

          <HStack spacing={8} align="start">
            <VStack flex={2} spacing={6} align="stretch">
              <Box bg="white" p={6} borderRadius="lg" shadow="md">
                <VStack spacing={4} align="stretch">
                  <HStack>
                    <SafeIcon icon={FiLock} className="text-teal-500" />
                    <Heading size="md">Payment Details</Heading>
                  </HStack>
                  
                  <FormControl>
                    <FormLabel>Payment Method</FormLabel>
                    <Select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="points">Points</option>
                      <option value="card">Credit Card</option>
                    </Select>
                  </FormControl>

                  {paymentMethod === 'card' && (
                    <VStack spacing={3} align="stretch">
                      <FormControl>
                        <FormLabel>Card Number</FormLabel>
                        <Input placeholder="1234 5678 9012 3456" />
                      </FormControl>
                      <HStack>
                        <FormControl>
                          <FormLabel>Expiry</FormLabel>
                          <Input placeholder="MM/YY" />
                        </FormControl>
                        <FormControl>
                          <FormLabel>CVV</FormLabel>
                          <Input placeholder="123" type="password" maxLength={3} />
                        </FormControl>
                      </HStack>
                    </VStack>
                  )}
                </VStack>
              </Box>

              <Box bg="white" p={6} borderRadius="lg" shadow="md">
                <VStack spacing={4} align="stretch">
                  <HStack>
                    <SafeIcon icon={FiGift} className="text-teal-500" />
                    <Heading size="md">Promo Code</Heading>
                  </HStack>
                  <HStack>
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button colorScheme="teal" onClick={handlePromoCode}>
                      Apply
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            </VStack>

            <Box flex={1} bg="white" p={6} borderRadius="lg" shadow="md">
              <VStack spacing={4} align="stretch">
                <Heading size="md">Order Summary</Heading>
                <VStack spacing={3} align="stretch">
                  <HStack justify="space-between">
                    <Text>Subtotal</Text>
                    <Text>{points} points</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text>Shipping</Text>
                    <Badge colorScheme="green">Free</Badge>
                  </HStack>
                  <Divider />
                  <HStack justify="space-between" fontWeight="bold">
                    <Text>Total</Text>
                    <Text color="teal.500">{points} points</Text>
                  </HStack>
                </VStack>
                <Button
                  colorScheme="teal"
                  size="lg"
                  onClick={handleCheckout}
                  leftIcon={<SafeIcon icon={FiCreditCard} />}
                >
                  Complete Purchase
                </Button>
              </VStack>
            </Box>
          </HStack>
        </VStack>
      </MotionBox>
    </Container>
  );
};

export default Checkout;