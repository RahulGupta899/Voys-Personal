import React from 'react'
import {Form, Input, Button, Select, message} from 'antd'
import axios from 'axios';
const {Option} = Select



function AddUser(){

    const [form] = Form.useForm(); //Ref of form 

    function handleTypeChange(){
        console.log("Handle type change executed...")
    }

    // When we submit the form this will execute
    async function onFinish(values){
        console.log("On Finish executed...")
        console.log(values)

        const hostType = "http://localhost:8000"
        const url = `${hostType}/api/signup`
        console.log(url)

        const {data} = await axios.post(url,values)
        console.log("POST DATA")
        console.log(data)

        console.log("Success: ",data.success)

        if(data.success){
            form.resetFields();
            message.success("User Added Successfully...")
        }
        else{
            message.error("Something went Wrong, can't add user")
        }
    }

    function onFinishFailed(err){
        console.log("On Finished Failed...")
        console.log("Failed Message")
    }

    return(
        <>
            <h1>ADD USER</h1>

            <div>
                <Form
                    className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                    form={form}
                    id="form"
                    name="basic"
                    labelCol={{
                        span:24
                    }}
                    wrapperCol={{
                        span:24
                    }}
                    initialValues={{
                        remember:true
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off" // ??
                >

                    <Form.Item
                        className="block text-gray-700 text-sm font-bold mb-2"
                        label="First Name"
                        name="firstName"
                        rules={[
                            {
                                required:true,
                                message:"Please enter first name"
                            }
                        ]}
                    >
                        <Input placeholder="John"/>
                    </Form.Item>
                    
                    <Form.Item
                        className="block text-gray-700 text-sm font-bold mb-2"
                        label="Last Name"
                        name="lastName"
                        rules={[
                            {
                                required:true,
                                message:"please enter last name"
                            }
                        ]}
                    >
                        <Input placeholder="Doe"/>
                    </Form.Item>

                    <Form.Item
                        className="block text-gray-700 text-sm font-bold mb-2"
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required:true,
                                message:"please enter your email"
                            }
                        ]}
                    >
                        <Input placeholder="user@omindtech.com"/>
                    </Form.Item>

                    <Form.Item
                        className="block text-gray-700 text-sm font-bold mb-2"
                        label="password"
                        name="password"
                        rules={[
                            {
                                required:true,
                                message:"please enter password"
                            }
                        ]}
                    >
                        <Input.Password placeholder="*******"/>
                    </Form.Item>

                    <Form.Item
                        className="border-2 p-8 text-bold"
                        label="Access Type"
                        name="role"
                        rules={[
                            {
                                required:true,
                                message:"please select access Type"
                            }
                        ]}
                    >
                        <Select
                            className="text-rose-900"
                            onChange={handleTypeChange}
                            placeholder="Select Access Type"
                        >
                            <Option value={3}>Developer</Option>
                            <Option value={2}>Admin</Option>
                            <Option value={1}>Quality Manager</Option>
                            <Option value={0}>Quality Analyst</Option>
                        </Select>

                    </Form.Item>
                    <br/><br/><br/><br/>
                    
                    <div className="border-2 p-8">
                        <Form.Item
                            className="block text-gray-700 text-sm font-bold mb-2"
                            label="Campaign"
                            name="campaign"
                            rules={[
                                {
                                    required:true,
                                    message:"please select campaign"
                                }
                            ]}
                        >
                            <Select
                                className="m-8  flex flex-row text-green-700	"
                                mode="multiple"
                                style={{width:'100%'}}
                                placeholder='select campaign'
                                defaultValue={[]}
                                onChange={handleTypeChange}
                            >
                                <Option value="vital">Vital</Option>
                                <Option value="idealLiving">idealLiving</Option>
                                <Option value="india">india</Option>
                                <Option value="phs">phs</Option>
                                <Option value="oyoAzure">oyoAzure</Option>
                                <Option value="kotak">kotak</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    

                    <br/><br/><br/><br/>
                    <Form.Item>
                        <Button
                            className=" m-4 ml-48 bg-blue-500 hover:bg-blue-700 text-white font-bold py-5 px-8 border border-blue-700 rounded"
                            type="primary"
                            htmlType="submit"
                            id="'signin-btn"
                        >
                        Add User
                        </Button>
                    </Form.Item> 

                </Form>
            </div>
        </>
    )
}
export default AddUser;