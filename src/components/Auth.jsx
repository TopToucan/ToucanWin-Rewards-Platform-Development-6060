import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  Image,
  Input,
  FormControl,
  FormLabel,
  useToast,
  FormErrorMessage,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  InputGroup,
  InputRightElement,
  Divider,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useSteps,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  useColorModeValue,
  SimpleGrid,
  Flex,
  Avatar,
  Icon,
  Stack,
  Badge
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { 
  FiUser, FiLock, FiMail, FiEye, FiEyeOff, FiAward, 
  FiShoppingBag, FiGift, FiTrendingUp, FiUsers, 
  FiHeart, FiBarChart2, FiStar, FiMessageSquare 
} = FiIcons;

const MotionBox = motion(Box);
const MotionButton = motion(Button);
const MotionVStack = motion(VStack);
const MotionFlex = motion(Flex);

const steps = [
  { title: 'Earn Points', description: 'Upload receipts and complete activities', icon: FiAward },
  { title: 'Join Campaigns', description: 'Participate in special campaigns for bonus points', icon: FiShoppingBag },
  { title: 'Bid in Auctions', description: 'Use your points to bid on exclusive items', icon: FiTrendingUp },
  { title: 'Redeem Rewards', description: 'Exchange your points for valuable rewards', icon: FiGift }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Gold Member",
    content: "I've earned over 5,000 points in just 3 months! The auctions are super fun and I've already won two premium prizes.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Silver Member",
    content: "The receipt upload feature is so convenient. I earn points for purchases I'm already making. Brilliant rewards program!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
    rating: 4
  },
  {
    name: "Emily Rodriguez",
    role: "Platinum Member",
    content: "ToucanWin has transformed how I shop. The community campaigns are engaging and the rewards are actually worth it!",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
    rating: 5
  }
];

const StatCard = ({ icon, value, label }) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      bg="white"
      p={6}
      borderRadius="xl"
      shadow="md"
      textAlign="center"
      borderTop="4px solid"
      borderTopColor="teal.500"
    >
      <VStack spacing={3}>
        <Box color="teal.500">
          <SafeIcon icon={icon} className="text-3xl" />
        </Box>
        <Text fontSize="3xl" fontWeight="bold" color="teal.600">
          {value}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {label}
        </Text>
      </VStack>
    </MotionBox>
  );
};

const TestimonialCard = ({ testimonial, delay }) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      bg="white"
      p={5}
      borderRadius="lg"
      shadow="md"
      borderLeft="4px solid"
      borderLeftColor="teal.500"
    >
      <VStack spacing={3} align="start">
        <HStack spacing={3}>
          <Avatar size="md" src={testimonial.avatar} name={testimonial.name} />
          <Box>
            <Text fontWeight="bold">{testimonial.name}</Text>
            <Text fontSize="sm" color="gray.500">{testimonial.role}</Text>
          </Box>
        </HStack>
        
        <HStack spacing={1}>
          {Array(5).fill("").map((_, i) => (
            <Icon 
              key={i} 
              as={FiStar} 
              color={i < testimonial.rating ? "yellow.400" : "gray.300"} 
            />
          ))}
        </HStack>
        
        <Text fontSize="sm" color="gray.600">"{testimonial.content}"</Text>
      </VStack>
    </MotionBox>
  );
};

const Auth = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });
  const initialFocusRef = useRef();
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleTabChange = (index) => {
    setTabIndex(index);
    setErrors({});
    setFormData({
      email: '',
      password: '',
      name: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({...errors, [name]: ''});
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (tabIndex === 1 && !formData.name) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (Math.random() > 0.8) {
      // Simulate error for demonstration purposes (20% chance)
      setIsLoading(false);
      setErrors({
        general: tabIndex === 0 
          ? 'Invalid email or password. Please try again.' 
          : 'An account with this email already exists.'
      });
      return;
    }

    toast({
      title: tabIndex === 0 ? "Login Successful!" : "Account Created!",
      description: tabIndex === 0 
        ? "Welcome back to ToucanWin Rewards!" 
        : "Your account has been created successfully. Welcome to ToucanWin Rewards!",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    
    setIsLoading(false);

    // Show onboarding after successful registration
    if (tabIndex === 1) {
      setTimeout(() => {
        onOpen();
      }, 1000);
    }
  };

  return (
    <>
      <Container as="main" role="main" maxW="container.xl" p={8}>
        <MotionBox 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          maxW="500px" 
          mx="auto" 
          mb={16}
        >
          <MotionVStack 
            spacing={8} 
            textAlign="center" 
            py={10} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Image 
                src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1752867222479-blob" 
                alt="ToucanWin Rewards Logo" 
                height="100px" 
                mb={4} 
                loading="eager" 
              />
            </motion.div>
            
            <Heading as="h1" size="xl" color="teal.600">
              Welcome to ToucanWin Rewards
            </Heading>
            
            <Text fontSize="lg" color="gray.600" maxW="400px">
              Join our rewards program to earn points and unlock exclusive benefits
            </Text>

            <Box 
              as="section" 
              bg={bgColor}
              p={8} 
              borderRadius="xl" 
              shadow="lg" 
              w="full" 
              border="1px solid"
              borderColor={borderColor}
              role="form"
            >
              <Tabs 
                isFitted 
                colorScheme="teal" 
                index={tabIndex} 
                onChange={handleTabChange}
                variant="soft-rounded"
                mb={6}
              >
                <TabList mb={6}>
                  <Tab 
                    fontWeight="semibold" 
                    _selected={{ bg: 'teal.500', color: 'white' }}
                  >
                    Login
                  </Tab>
                  <Tab 
                    fontWeight="semibold"
                    _selected={{ bg: 'teal.500', color: 'white' }}
                  >
                    Register
                  </Tab>
                </TabList>

                <TabPanels>
                  {/* Login Panel */}
                  <TabPanel p={0}>
                    <form onSubmit={handleSubmit} noValidate>
                      <VStack spacing={6}>
                        <FormControl isInvalid={!!errors.email} isRequired>
                          <FormLabel htmlFor="login-email">
                            <SafeIcon icon={FiMail} className="inline mr-2" aria-hidden="true" />
                            Email
                          </FormLabel>
                          <Input
                            id="login-email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            focusBorderColor="teal.500"
                            errorBorderColor="red.500"
                            aria-describedby={errors.email ? "email-error" : undefined}
                            size="lg"
                          />
                          <FormErrorMessage id="email-error">
                            {errors.email}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.password} isRequired>
                          <FormLabel htmlFor="login-password">
                            <SafeIcon icon={FiLock} className="inline mr-2" aria-hidden="true" />
                            Password
                          </FormLabel>
                          <InputGroup size="lg">
                            <Input
                              id="login-password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              value={formData.password}
                              onChange={handleInputChange}
                              placeholder="Enter your password"
                              focusBorderColor="teal.500"
                              errorBorderColor="red.500"
                              aria-describedby={errors.password ? "password-error" : undefined}
                            />
                            <InputRightElement width="4.5rem">
                              <Button
                                h="1.75rem"
                                size="sm"
                                onClick={() => setShowPassword(!showPassword)}
                                variant="ghost"
                              >
                                <SafeIcon icon={showPassword ? FiEyeOff : FiEye} />
                              </Button>
                            </InputRightElement>
                          </InputGroup>
                          <FormErrorMessage id="password-error">
                            {errors.password}
                          </FormErrorMessage>
                        </FormControl>

                        {errors.general && (
                          <Box 
                            p={3} 
                            bg="red.50" 
                            color="red.600" 
                            borderRadius="md" 
                            w="full" 
                            textAlign="center"
                          >
                            {errors.general}
                          </Box>
                        )}

                        <Button 
                          variant="link" 
                          alignSelf="flex-end" 
                          colorScheme="teal" 
                          size="sm"
                          mt={-4}
                        >
                          Forgot password?
                        </Button>

                        <MotionButton
                          type="submit"
                          colorScheme="teal"
                          size="lg"
                          width="full"
                          isLoading={isLoading}
                          loadingText="Signing in..."
                          mt={2}
                          whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(56, 178, 172, 0.3)" }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                        >
                          Sign In
                        </MotionButton>

                        <Divider my={4} />

                        <Text fontSize="sm" color="gray.600">
                          Don't have an account?{" "}
                          <Button 
                            variant="link" 
                            colorScheme="teal" 
                            onClick={() => handleTabChange(1)}
                          >
                            Sign up now
                          </Button>
                        </Text>
                      </VStack>
                    </form>
                  </TabPanel>

                  {/* Register Panel */}
                  <TabPanel p={0}>
                    <form onSubmit={handleSubmit} noValidate>
                      <VStack spacing={6}>
                        <FormControl isInvalid={!!errors.name} isRequired>
                          <FormLabel htmlFor="register-name">
                            <SafeIcon icon={FiUser} className="inline mr-2" aria-hidden="true" />
                            Full Name
                          </FormLabel>
                          <Input
                            id="register-name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            focusBorderColor="teal.500"
                            errorBorderColor="red.500"
                            aria-describedby={errors.name ? "name-error" : undefined}
                            size="lg"
                          />
                          <FormErrorMessage id="name-error">
                            {errors.name}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.email} isRequired>
                          <FormLabel htmlFor="register-email">
                            <SafeIcon icon={FiMail} className="inline mr-2" aria-hidden="true" />
                            Email
                          </FormLabel>
                          <Input
                            id="register-email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            focusBorderColor="teal.500"
                            errorBorderColor="red.500"
                            aria-describedby={errors.email ? "email-error" : undefined}
                            size="lg"
                          />
                          <FormErrorMessage id="email-error">
                            {errors.email}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.password} isRequired>
                          <FormLabel htmlFor="register-password">
                            <SafeIcon icon={FiLock} className="inline mr-2" aria-hidden="true" />
                            Password
                          </FormLabel>
                          <InputGroup size="lg">
                            <Input
                              id="register-password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              value={formData.password}
                              onChange={handleInputChange}
                              placeholder="Create a password"
                              focusBorderColor="teal.500"
                              errorBorderColor="red.500"
                              aria-describedby={errors.password ? "password-error" : "password-help"}
                            />
                            <InputRightElement width="4.5rem">
                              <Button
                                h="1.75rem"
                                size="sm"
                                onClick={() => setShowPassword(!showPassword)}
                                variant="ghost"
                              >
                                <SafeIcon icon={showPassword ? FiEyeOff : FiEye} />
                              </Button>
                            </InputRightElement>
                          </InputGroup>
                          <FormErrorMessage id="password-error">
                            {errors.password}
                          </FormErrorMessage>
                          {!errors.password && (
                            <Text id="password-help" fontSize="sm" color="gray.500" mt={1}>
                              Password must be at least 6 characters long
                            </Text>
                          )}
                        </FormControl>

                        {errors.general && (
                          <Box 
                            p={3} 
                            bg="red.50" 
                            color="red.600" 
                            borderRadius="md" 
                            w="full" 
                            textAlign="center"
                          >
                            {errors.general}
                          </Box>
                        )}

                        <MotionButton
                          type="submit"
                          colorScheme="teal"
                          size="lg"
                          width="full"
                          isLoading={isLoading}
                          loadingText="Creating account..."
                          mt={4}
                          whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(56, 178, 172, 0.3)" }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                        >
                          Create Account
                        </MotionButton>

                        <Divider my={4} />

                        <Text fontSize="sm" color="gray.600">
                          Already have an account?{" "}
                          <Button 
                            variant="link" 
                            colorScheme="teal" 
                            onClick={() => handleTabChange(0)}
                          >
                            Sign in
                          </Button>
                        </Text>
                      </VStack>
                    </form>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </MotionVStack>
        </MotionBox>

        {/* Stats Section */}
        <Box as="section" py={16} bg="gray.50" borderRadius="xl" mb={16}>
          <Container maxW="container.xl">
            <VStack spacing={12}>
              <Heading textAlign="center" size="xl" color="teal.600">Our Community Impact</Heading>
              
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
                <StatCard icon={FiUsers} value="10K+" label="Active Members" />
                <StatCard icon={FiAward} value="1.2M+" label="Points Earned" />
                <StatCard icon={FiShoppingBag} value="50+" label="Active Campaigns" />
                <StatCard icon={FiGift} value="5,300+" label="Rewards Claimed" />
              </SimpleGrid>
              
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                maxW="3xl"
                textAlign="center"
                mx="auto"
              >
                <Text fontSize="lg" color="gray.600">
                  Join thousands of members already enjoying exclusive rewards, participating in exciting campaigns, and making a difference through our community initiatives.
                </Text>
              </MotionBox>
            </VStack>
          </Container>
        </Box>
        
        {/* Community Impact Section */}
        <Box as="section" py={16} mb={16}>
          <Container maxW="container.xl">
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10} alignItems="center">
              <MotionBox
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <VStack align="start" spacing={6}>
                  <Badge colorScheme="teal" px={3} py={1} fontSize="md" borderRadius="full">
                    Our Mission
                  </Badge>
                  
                  <Heading color="gray.800" size="xl">
                    Making a Difference Together
                  </Heading>
                  
                  <Text color="gray.600" fontSize="lg">
                    ToucanWin Rewards isn't just about earning points—it's about creating a community that makes a positive impact. Through our collaborative campaigns, we've helped:
                  </Text>
                  
                  <VStack align="start" spacing={4} pl={4}>
                    <HStack>
                      <Icon as={FiHeart} color="teal.500" boxSize={5} />
                      <Text fontWeight="medium">Plant 5,000+ trees through our eco-campaigns</Text>
                    </HStack>
                    
                    <HStack>
                      <Icon as={FiHeart} color="teal.500" boxSize={5} />
                      <Text fontWeight="medium">Donate $25,000+ to charitable causes</Text>
                    </HStack>
                    
                    <HStack>
                      <Icon as={FiHeart} color="teal.500" boxSize={5} />
                      <Text fontWeight="medium">Support 100+ local businesses through member purchases</Text>
                    </HStack>
                  </VStack>
                  
                  <Text color="gray.600">
                    Every point you earn contributes to these initiatives. Join us and be part of something bigger!
                  </Text>
                </VStack>
              </MotionBox>
              
              <MotionFlex
                justify="center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=600"
                  alt="Community volunteering"
                  borderRadius="xl"
                  shadow="xl"
                  objectFit="cover"
                  maxH="400px"
                />
              </MotionFlex>
            </SimpleGrid>
          </Container>
        </Box>

        {/* Testimonials Section */}
        <Box as="section" py={16} bg="gray.50" borderRadius="xl">
          <Container maxW="container.xl">
            <VStack spacing={12}>
              <Stack spacing={4} textAlign="center" maxW="2xl" mx="auto">
                <Heading size="xl" color="teal.600">
                  What Our Members Say
                </Heading>
                <Text color="gray.600" fontSize="lg">
                  Real experiences from our community of reward enthusiasts
                </Text>
              </Stack>
              
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                {testimonials.map((testimonial, index) => (
                  <TestimonialCard 
                    key={index} 
                    testimonial={testimonial} 
                    delay={0.2 + index * 0.1} 
                  />
                ))}
              </SimpleGrid>
              
              <HStack spacing={2}>
                <SafeIcon icon={FiMessageSquare} className="text-teal-500" />
                <Text color="teal.500" fontWeight="medium">
                  Based on 500+ verified member reviews
                </Text>
              </HStack>
            </VStack>
          </Container>
        </Box>
      </Container>

      {/* Onboarding Modal */}
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        isCentered 
        size="xl"
        initialFocusRef={initialFocusRef}
        motionPreset="slideInBottom"
      >
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="xl">
          <ModalHeader 
            color="teal.600" 
            borderBottomWidth="1px" 
            borderColor="gray.100"
            pb={4}
          >
            Welcome to ToucanWin Rewards!
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody py={6}>
            <VStack spacing={8} align="stretch">
              <Text color="gray.600">
                Let's get you started with how our rewards program works. Follow these simple steps to make the most of your membership:
              </Text>
              
              <Box p={4} bg="teal.50" borderRadius="lg">
                <Stepper index={activeStep} orientation="vertical" gap="0" colorScheme="teal">
                  {steps.map((step, index) => (
                    <Step key={index} onClick={() => setActiveStep(index)} cursor="pointer">
                      <StepIndicator>
                        <StepStatus
                          complete={<StepIcon />}
                          incomplete={<SafeIcon icon={step.icon} />}
                          active={<StepNumber />}
                        />
                      </StepIndicator>

                      <Box flexShrink="0">
                        <StepTitle>{step.title}</StepTitle>
                        <StepDescription>{step.description}</StepDescription>
                      </Box>

                      <StepSeparator />
                    </Step>
                  ))}
                </Stepper>
              </Box>
              
              <HStack justify="center">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setActiveStep(Math.max(activeStep - 1, 0))}
                  isDisabled={activeStep === 0}
                >
                  Previous
                </Button>
                <Button 
                  size="sm" 
                  colorScheme="teal" 
                  onClick={() => setActiveStep(Math.min(activeStep + 1, steps.length - 1))}
                  isDisabled={activeStep === steps.length - 1}
                >
                  Next
                </Button>
              </HStack>
            </VStack>
          </ModalBody>

          <ModalFooter borderTopWidth="1px" borderColor="gray.100">
            <Button 
              colorScheme="teal" 
              mr={3} 
              onClick={onClose}
              ref={initialFocusRef}
            >
              Get Started
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Auth;