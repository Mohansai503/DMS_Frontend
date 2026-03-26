import React from 'react'
import emailjs from "emailjs-com";
import {useNavigate} from 'react-router-dom';

const Login = () => {

    const navigate = useNavigate();

    const[email,setEmail] = React.useState('');
    const[otp,setOtp] = React.useState('');

    const [errors,setErrors] = React.useState<{email?:string, otp?:string}>({});
    const [otpSent,setOtpSent] = React.useState<boolean>(false);
    const [otpVerified,setOtpVerified] = React.useState<boolean>(false);

    //Email Validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const validateEmail = (value: string) => {
        if(!value.trim()) {
            return "Email is required";
        }  
        if(!emailRegex.test(value)) {
            return "Enter the valid email address";
        } 
        return "";
    }

    //OTP Validation
    const validateOtp = (value: string) => {
        if(!value.trim()) {
            return "OTP is required";
        }
        if(value.length !== 6) {
            return "OTP must be 6 digits";
        }
        return "";
    }

    //OTP sending 
    const sendOtp = async () => {
        const emailError = validateEmail(email);
        setErrors((prevErrors) => ({ ...prevErrors, email: emailError || undefined }));
        if(emailError) {
            return;
        }

            try {
                //Call backend controller to generate OTP
                const response = await fetch(

                    'http://localhost:8080/loginpage/send-otp',
                     { 

                

                        method: "POST" ,
                        headers : {
                            "Content-type" : "application/json",
                        }
                     ,
                     body : JSON.stringify({userEmailId: email} )
                    }
                );
             console.log(response);
                if (!response.ok) {
                    const msg = await response.text();
                    //alert(msg);
                    navigate("/loginfail");
                    return;
                }       
        
            const backendOtp = await response.text();
        
            //Send OTP using EmailJS
             const templateParams = { to_email: email,otp: backendOtp };
        
            // await emailjs.send(
            //     "service_ya75vo6",
            //     "template_hivulbq",
            //     templateParams,
            //     "YTk8-jrq6IfbGg5Sp"
            // );
        


            /*console.log("OTP sent successfully to", email);
            alert("OTP sent to your email!");
            setOtpSent(true);
            setOtpVerified(false);*/

        
            } catch (error) {
                console.error("Failed sending OTP:", error);
                alert("Failed to send OTP");
            }

    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const emailError = validateEmail(email);
        const otpEerror = validateOtp(otp);

        setErrors({ email: emailError || undefined, otp: otpEerror || undefined });

        if(emailError || otpEerror) {
            return;
        }

        try {
            const verifyResponse = await fetch(


                `http://localhost:8080/loginpage/verify-otp`,
                { method: "POST" ,
                    headers : {

                            "Content-type" : "application/json"
                        }
                     ,
                     body : JSON.stringify({email: email,
                                            otp: otp
                     } )

                    }

                 

            );
            

            const msg = await verifyResponse.json();
            console.log(msg);

           //* alert(msg);
           const accessToken = msg.token;
           const userId = msg.userId;
            console.log(accessToken);
            sessionStorage.setItem("token",accessToken);
            sessionStorage.setItem("userId",userId);


        



            if (verifyResponse.ok) {
                navigate("/loginsuccess");
            } else {
                navigate("/loginfail");
            }

        } catch (error) {
            navigate("/loginfail");
        }

    }

  return (
    <div>
        <div className='min-vh-100 d-flex align-items-center justify-content-center bg-light'>
            <form onSubmit={handleSubmit} className='p-4 shadow rounded-4 bg-white' style={{width: "450px"}}>
                <h2 className='text-center m-4 mb-5'>Login Form</h2>

                <hr className='mb-4'/>

                <div className="mb-3 row gx-2 align-items-start">
                    <div className="col-8">
                        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className='form-control'/>
                        <small className="text-danger d-block" style={{ minHeight: "18px" }}>{errors.email}</small>
                    </div>
                    <div className="col-4">
                        <button type='button' onClick={sendOtp} className='btn btn-primary w-100' disabled={!!validateEmail(email)} >{otpSent ? 'Resend OTP' : 'Send OTP'}</button>
                    </div>
                </div>

                <div className="mb-3 row gx-2 align-items-start">
                    <div className="mb-3">
                        <input type='otp' value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className='form-control'/>
                        <small className="text-danger d-block" style={{ minHeight: "18px" }}>{errors.otp}</small>
                        {otpVerified && <small className="text-success d-block">OTP Verified Successfully!</small>}
                    </div>
                    {/* <div className="col-4">
                        <button type='button' onClick={verifyOtp} className='btn btn-success w-100' disabled={!otpSent}>Verify OTP</button>
                    </div> */}
                </div>
                <div className="mb-4">
                    <input type='submit' value="Login" className='btn btn-primary w-100'/>
                </div>

                <hr />

                <div className='text-center m-4'>
                    <p>Don't have an accoount.? <a onClick={() => navigate('/reg')} className='fw-semibold' role='button'>SignUp</a></p>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Login