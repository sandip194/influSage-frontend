import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { RiEyeLine, RiEyeOffLine } from '@remixicon/react';
import '../../assets/login.css'; // Same CSS used for login & signup
import axios from 'axios';
import { toast } from 'react-toastify';
import SideImageSlider from '../../components/common/SideImageSlider';

export const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👁️ Toggle state
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      setLoading(true)
      const role = localStorage.getItem('selectedRole');
      const userEmail = data.email;
      localStorage.setItem('signupEmail', userEmail);
      // If role is not selected, redirect to role selection
      if (!role) {
        toast.error('Please select a role first!', { position: "top-right" });
        return navigate('/role');
      }

      const userData = {
        ...data,
        roleId: Number(role)
      }
      const response = await axios.post('/user/register', userData);

      if (response.status === 400) {
        console.log("response", response.data.message);
        toast.error(response.data.message || "Email already exists");
      }

      if (response.status === 200) {
        localStorage.setItem('isCreatedNew', response.data.message);
        toast.success('Signup successful! Please verify your email or mobile.');
        navigate('/verify-email-or-mobile');
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed. Please try again.");
      console.error("Signup failed:", error);
    } finally {
      setLoading(false); // 🔹 always re-enable after request
    }
  };

  return (
    <div className="login-container">
      <div className={`login-card h-90vh`}>
        {/* Left Image Section */}
        <SideImageSlider />
        {/* Right Form Section */}
        <div className="login-card-right">
          <form onSubmit={handleSubmit(submitHandler)}>
            <h2>Create Account</h2>
            <p>Start your journey with InfluSage today!</p>

            <label>First Name
              <span className='text-red-500 text-sm'>*</span>
            </label>
            <input
              type="text"
              placeholder="Enter first name"
              {...register('firstName', { required: "First name is required" })}
            />
            <span className='text-for-error'>{errors.firstName?.message}</span>

            <label>Last Name
              <span className='text-red-500 text-sm'>*</span>
            </label>
            <input
              type="text"
              placeholder="Enter last name"
              {...register('lastName', { required: "Last name is required" })}
            />
            <span className='text-for-error'>{errors.lastName?.message}</span>

            <label>Email
              <span className='text-red-500 text-sm'>*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your email"
              {...register('email', {
                required: "Email is required",
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "Invalid email format"
                }
              })}
            />
            <span className='text-for-error'>{errors.email?.message}</span>

            {/* <label>Phone Number</label>
            <input
              type="text"
              placeholder="Enter 10-digit phone number"
              {...register('phone', {
                required: "Phone number is required",
                pattern:{
                //8
                value:/[6-9]{1}[0-9]{9}/,
                message:"contact is not valid*"
            }
              })}
            />
            <span>{errors.phone?.message}</span> */}


            <label>Password
              <span className='text-red-500 text-sm'>*</span>
            </label>

            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                {...register('password', {
                  required: "Password is required",
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                    message: "Password must have 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char"
                  }
                })}
              />
              <span className="eye-icon" onClick={() => setShowPassword(prev => !prev)}>
                {showPassword ? <RiEyeOffLine className='w-[18px]' /> : <RiEyeLine className='w-[18px]' />}
              </span>
            </div>

            <span className='text-for-error'>{errors.password?.message}</span>

            {/* ✅ Terms & Conditions Checkbox */}
            <div style={{ marginTop: "10px", fontSize: "14px", marginBottom: "10px" }}>
              <label>
                <input type="checkbox" {...register("terms", { required: "Please accept terms & conditions" })} />
                &nbsp;I agree to&nbsp;
                <span style={{ color: "#0066cc", cursor: "pointer" }} onClick={() => setShowModal(true)}>
                  Terms & Conditions
                </span>
              </label>

              <span style={{ color: "red", fontSize: "12px" }}>{errors.terms?.message}</span>
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading} // 🔹 disable while loading
            >
              {loading ? "Signing Up..." : "Sign Up"} {/* 🔹 show spinner text */}
            </button>

            <div className="signup-link">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </div>

      {/* ✅ Modal for Terms and Conditions */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
          justifyContent: "center", alignItems: "start", zIndex: 999,
        }}>
          <div style={{
            background: "white", padding: "30px", borderRadius: "15px",
            maxWidth: "780px", width: "90%", textAlign: "left", position: "relative", marginTop: "20px",
            overflowY: "scroll", height: "90vh", scrollbarWidth: "none", scrollbarColor: "#999 #f1f1f1"
          }}>
            <h3 style={{ marginBottom: "10px" }}>Terms and Conditions</h3>
            <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
              By using this platform, you agree to comply with our policies and guidelines.
              <br /><br />
              This is a placeholder for your detailed terms. You can replace this with your actual T&C content.
              <br />
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia delectus iure voluptatibus libero quos dolorum obcaecati consequatur laborum, soluta totam saepe ipsam ducimus itaque nemo asperiores exercitationem harum aut officiis error facere amet similique placeat. Accusantium sapiente quasi facere voluptatibus et consequatur exercitationem. Eos nulla ipsum quod laborum vitae eum consectetur delectus saepe eligendi, labore architecto incidunt, iusto, vel ex. Ut provident expedita error! Aut laborum laudantium voluptate quod quaerat, ab cum totam adipisci. Id velit nulla autem et eos voluptates nemo. Porro nesciunt dolores maiores laboriosam debitis tempora aliquam dicta dignissimos omnis tenetur? Optio quasi iure aspernatur accusamus blanditiis, eaque dolore sapiente beatae dignissimos facilis ad itaque esse praesentium minus inventore omnis delectus rerum aliquam aliquid velit minima officiis quod explicabo? Beatae commodi nam exercitationem tenetur ut explicabo illo facere vero veniam atque reiciendis nulla nemo, odit, deserunt nesciunt. Repellendus blanditiis eligendi quo doloribus reprehenderit ipsum delectus molestiae sed, vel non voluptatum nostrum, voluptatem cumque tenetur laudantium, corrupti laborum dolores enim iure ab nihil nesciunt possimus voluptate provident! Impedit commodi laborum nisi id veritatis, mollitia cupiditate possimus ut ducimus quaerat excepturi aliquam eveniet delectus, sapiente consequatur, nostrum laudantium explicabo aliquid vero esse minima quod. Facere quo dolor accusamus nemo qui. Iste quidem sed ullam reiciendis enim voluptatem error maxime suscipit perspiciatis quibusdam. Sapiente eaque eos perspiciatis molestias cumque voluptatum praesentium repellat placeat fugit ullam, aliquid adipisci maiores deserunt ipsa, non nemo repellendus harum possimus nisi at enim quas, nihil nobis! Itaque similique animi dolores aliquid earum provident omnis deleniti autem reiciendis necessitatibus! Optio natus in sequi ad, est error culpa provident odio numquam deserunt omnis eaque blanditiis dicta iste veritatis aspernatur quo temporibus! Officiis praesentium quisquam porro dolorum unde tenetur sed deserunt doloribus fuga ipsum reprehenderit explicabo accusamus, sapiente expedita alias quo voluptate quos doloremque necessitatibus exercitationem! Non, porro? Iste provident animi voluptates natus a, cumque similique quaerat modi magni amet blanditiis assumenda nihil reiciendis eius architecto. Tempora fuga dicta iste quasi expedita quis aliquid nihil quae dolorum dolores iure quibusdam adipisci, tempore illo a possimus sint, aliquam voluptates. Tempore odio non eos libero aspernatur perspiciatis quo corrupti magnam iure beatae! Corrupti, veritatis fugiat necessitatibus fugit facere quasi voluptates nam consectetur similique voluptatum accusamus doloribus possimus incidunt minus error qui ex. Quibusdam reiciendis ut corrupti veritatis omnis, repellat est necessitatibus tenetur itaque molestiae alias, nulla ullam hic vel modi, ad atque. Alias aut voluptate illum eum exercitationem cum ad in quidem quos est? Velit, non. Asperiores exercitationem suscipit ex cupiditate nemo laudantium repellat accusamus modi quae consectetur debitis provident quis qui, omnis aspernatur! Delectus, accusantium dolores perspiciatis ducimus aliquam doloribus veniam eaque quod recusandae magni ipsum impedit eligendi officia temporibus sunt tempora numquam quam rem? Molestias voluptatibus sunt corporis quas nemo, similique tempora eum ad alias in accusamus quae deleniti quo tempore saepe iure libero ab at sapiente. Qui tempore placeat ipsum dolore, laborum eveniet quia consequatur architecto vel quam expedita facilis voluptates ullam dolores laudantium impedit debitis cumque, consequuntur ut atque pariatur soluta, similique assumenda. Blanditiis, odio dicta.
            </p>
            <button onClick={() => setShowModal(false)} style={{
              marginTop: "20px",
              background: "#0d0e2f", color: "white", padding: "8px 16px",
              borderRadius: "8px", cursor: "pointer", float: "right"
            }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
