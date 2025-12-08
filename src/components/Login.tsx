import React from 'react'
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
    const sendOtp = () => {
        const emailError = validateEmail(email);
        setErrors((prevErrors) => ({ ...prevErrors, email: emailError || undefined }));
        if(emailError) {
            return;
        }

        try {
            //API Call for sending OTP to email ID.
            console.log('Sending OTP to', email);
            setOtpSent(true);
            setOtpVerified(false);
        } catch (error) {
            console.error('Failed sending OTP:', error);
        }

    }

    //OTP Verification
    const verifyOtp = () => {
        const otpEerror = validateOtp(otp);
        setErrors((prevErrors) => ({ ...prevErrors, otp: otpEerror || undefined }));
        if(otpEerror) {
            return;
        }
        try {
            //API Call for verifying OTP
            console.log('Verifying OTP', otp);
            setOtpVerified(true);
        } catch (error) {
            console.error('Failed verifying OTP:', error);
        }  
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const emailError = validateEmail(email);
        const otpEerror = validateOtp(otp);

        setErrors({ email: emailError || undefined, otp: otpEerror || undefined });

        if(emailError || otpEerror) {
            return;
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
                    <div className="col-8">
                        <input type='otp' value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className='form-control'/>
                        <small className="text-danger d-block" style={{ minHeight: "18px" }}>{errors.otp}</small>
                        {otpVerified && <small className="text-success d-block">OTP Verified Successfully!</small>}
                    </div>
                    <div className="col-4">
                        <button type='button' onClick={verifyOtp} className='btn btn-success w-100' disabled={!otpSent}>Verify OTP</button>
                    </div>
                </div>
                <div className="mb-4">
                    <input type='submit' value="Register" className='btn btn-primary w-100'/>
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