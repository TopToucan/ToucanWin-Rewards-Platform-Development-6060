import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  SimpleGrid,
  Text,
  HStack,
  useToast,
  Image,
  Divider,
  Badge,
  useColorModeValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiLock, FiCreditCard, FiCalendar, FiShield } = FiIcons;

const MotionBox = motion(Box);

const PaymentGateway = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.700');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Payment Successful!",
        description: "Your payment has been processed successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }, 2000);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        bgGradient="linear(to-r, teal.500, teal.400)" 
        color="white" 
        py={10}
      >
        <Container maxW="container.xl">
          <VStack spacing={4} textAlign="center">
            <SafeIcon icon={FiLock} className="text-4xl" />
            <Heading size="xl">Secure Checkout</Heading>
            <Text fontSize="lg" maxW="600px">
              Complete your purchase securely with our trusted payment gateway
            </Text>
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={12}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* Payment Form */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box 
              bg={cardBg} 
              p={8} 
              borderRadius="xl" 
              shadow="md"
            >
              <VStack spacing={6} align="stretch">
                <Heading size="md">Payment Details</Heading>

                <HStack spacing={4}>
                  {['card', 'paypal'].map((method) => (
                    <Button
                      key={method}
                      variant={paymentMethod === method ? 'solid' : 'outline'}
                      colorScheme="teal"
                      onClick={() => setPaymentMethod(method)}
                      flex="1"
                    >
                      <HStack>
                        <SafeIcon 
                          icon={method === 'card' ? FiCreditCard : FiShield} 
                        />
                        <Text>
                          {method === 'card' ? 'Credit Card' : 'PayPal'}
                        </Text>
                      </HStack>
                    </Button>
                  ))}
                </HStack>

                <form onSubmit={handleSubmit}>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Card Number</FormLabel>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        pattern="[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}"
                      />
                    </FormControl>

                    <SimpleGrid columns={3} spacing={4} w="full">
                      <FormControl isRequired>
                        <FormLabel>Expiry Month</FormLabel>
                        <Input placeholder="MM" maxLength={2} />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Expiry Year</FormLabel>
                        <Input placeholder="YY" maxLength={2} />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>CVV</FormLabel>
                        <Input type="password" placeholder="123" maxLength={3} />
                      </FormControl>
                    </SimpleGrid>

                    <FormControl isRequired>
                      <FormLabel>Cardholder Name</FormLabel>
                      <Input placeholder="Name as shown on card" />
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="teal"
                      size="lg"
                      w="full"
                      isLoading={isLoading}
                      loadingText="Processing..."
                      leftIcon={<SafeIcon icon={FiLock} />}
                    >
                      Pay Now
                    </Button>
                  </VStack>
                </form>
              </VStack>
            </Box>
          </MotionBox>

          {/* Order Summary */}
          <Box>
            <Box bg={cardBg} p={8} borderRadius="xl" shadow="md">
              <VStack spacing={6} align="stretch">
                <Heading size="md">Order Summary</Heading>
                
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Text>Subtotal</Text>
                    <Text fontWeight="bold">$99.99</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text>Tax</Text>
                    <Text fontWeight="bold">$10.00</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text>Shipping</Text>
                    <Badge colorScheme="green">Free</Badge>
                  </HStack>
                  
                  <Divider />
                  
                  <HStack justify="space-between" fontSize="lg" fontWeight="bold">
                    <Text>Total</Text>
                    <Text color="teal.500">$109.99</Text>
                  </HStack>
                </VStack>

                <Box bg="gray.50" p={4} borderRadius="md">
                  <VStack spacing={2}>
                    <HStack>
                      <SafeIcon icon={FiShield} className="text-teal-500" />
                      <Text fontWeight="medium">Secure Payment</Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      Your payment information is encrypted and secure
                    </Text>
                  </VStack>
                </Box>

                <SimpleGrid columns={3} spacing={4}>
                  {['visa', 'mastercard', 'amex'].map((card) => (
                    <Image
                      key={card}
                      src={`https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/payment-${card}.png`}
                      alt={`${card} accepted`}
                      height="30px"
                      objectFit="contain"
                      opacity={0.7}
                    />
                  ))}
                </SimpleGrid>
              </VStack>
            </Box>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default PaymentGateway;