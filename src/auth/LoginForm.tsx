import React, {useEffect, useState} from "react";
import { EyeInvisibleOutlined, EyeTwoTone, MailOutlined, LockOutlined } from "@ant-design/icons";
import {Link, useNavigate} from "react-router-dom";
import {Button, Form, Input, Checkbox, message, Row, Col} from "antd";
import {toast} from "react-toastify";
import {SignInApiResType, SignInResType, SignInType} from "./auth-types/AuthTypes";
import {signIn} from "../services/auth-services/AuthServices";
import {axiosApi} from "../services/axios_instances";
import {CommonErrorType} from "../components/common-types/CommonTypes";
interface LoginFormValues {
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  avatar?: string;
}

interface LoginFormProps {
  onSubmit?: (values: LoginFormValues) => void;
  isLoading?: boolean;
}

const LoginForm = ({
                     onSubmit,
                     isLoading: externalIsLoading = false,
                   }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isValue,setValue] = useState<number>(0);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(()=>{

  },[])

  const valueInCri =()=>{
    setValue(isValue + 1);
  }

  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const parsedUser:SignInResType = JSON.parse(savedUser);
          setIsAuthenticated(true);
          navigate("/admin");
        } catch (error) {
          localStorage.removeItem("user");
          navigate("/auth/login");
        }
      }
    };
    checkAuth();
  }, [navigate]);



  const onFinish = async (values: SignInType) => {
    if (onSubmit) {
      onSubmit(values);
      return;
    }
    setIsLoading(true);
    try {
      await signIn(values);
      toast.success('Login successfully!');
      navigate("/admin");
    }catch (error){
      toast.error('Internal server error');
    }finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="w-full max-w-md p-2 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        </div>

          <Form form={form} onFinish={onFinish} layout="vertical">
            <Row>
              <Col xs={24}>
                <Form.Item
                    label="User Name"
                    name="username"
                    rules={[
                      { required: true, message: "Please enter your user name" }
                    ]}
                >
                  <Input
                      size="large"
                      prefix={<MailOutlined className="text-gray-400" />}
                      placeholder="pahan"
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      { required: true, message: "Please enter your password" },
                      { min: 5, message: "Password must be at least 5 characters" },
                    ]}
                >
                  <Input.Password
                      size="large"
                      prefix={<LockOutlined className="text-gray-400" />}
                      placeholder="••••••••"
                      iconRender={(visible) =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                  />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">

                  </div>
                  <Link
                      to="/auth/forgot-password"
                      className="text-sm font-medium text-primary hover:text-primary/80"
                  >
                    Forgot password?
                  </Link>
                </div>
              </Col>

              <Col xs={24} className="mt-3">
                <Form.Item>
                  <Button
                      size="large"
                      color="default"
                      variant="solid"
                      htmlType="submit"
                      className="w-full"
                      loading={isLoading || externalIsLoading}
                      iconPosition="end"
                  >
                    {isLoading || externalIsLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
      </div>
  );
};

export default LoginForm;
