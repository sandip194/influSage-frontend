// import React, { useEffect, useState } from 'react';
// import { Form, Input, Spin } from 'antd';
// import axios from 'axios';
// import { message } from 'antd';
// import { useSelector } from 'react-redux';
// import { useMemo } from 'react';
// import { toast } from 'react-toastify';

// export const SocialMediaDetails = ({ onBack, onNext, data, onChange, showControls, showToast, onSave }) => {
//   const [providers, setProviders] = useState([])
//   const [form] = Form.useForm();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isFormChanged, setIsFormChanged] = useState(false);
//   const [isSkipped, setIsSkipped] = useState(false);

//   const { token } = useSelector(state => state.auth);
//   const BASE_URL = import.meta.env.VITE_API_BASE_URL;

//   const getAllPlatforms = async () => {
//     try {
//       const res = await axios.get("providers")
//       setProviders(res.data.data)
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   useEffect(() => {
//     getAllPlatforms()
//   }, [])

//   const platforms = useMemo(() => {
//     return providers.map((provider) => {
//       const field = provider.name.toLowerCase().replace(/\s+/g, ''); // sanitize field name
//       return {
//         name: provider.name,
//         providerid: provider.id,
//         icon: (
//           <img
//             src={provider.iconpath}
//             alt={provider.name}
//             className="w-[24px]"
//             onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
//           />
//         ),
//         field,
//         placeholder: `Enter your ${provider.name} link`,
//       };
//     });
//   }, [providers, BASE_URL]);



//   const onFinish = async (values, skipped = false) => {
//     try {
//       setIsSubmitting(true);
//       // Transform filled values into required array
//       const links = platforms
//         .filter(p => values[p.field]) // Only filled-in links
//         .map(p => ({
//           providerid: p.providerid,
//           handleslink: values[p.field],
//         }));

//       const providersjson = {
//         skipped,
//         completedAt: Date.now(),
//         links, // assuming you want the links array inside
//       };

//       const response = await axios.post(
//         'vendor/complete-vendor-profile', // replace with actual URL
//         { providersjson },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.status === 200) {
//         const successMessage =
//           response?.data?.message || "Profile updated successfully";

//         if (showToast) toast.success(successMessage);

//         setIsFormChanged(false);

//         // Stepper: Go to next
//         if (onNext) onNext();

//         // Edit Profile: Custom save handler
//         if (onSave) onSave();
//       }

//     } catch (error) {
//       console.error('❌ Failed to submit social links:', error);
//       message.error('Failed to submit social links.');
//     }
//     finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSkip = async () => {
//     setIsSkipped(true);
//     const values = form.getFieldsValue();
//     await onFinish(values, true);
//   };

//   useEffect(() => {
//     if (data && Array.isArray(data) && platforms.length > 0) {
//       const initialValues = {};

//       data.forEach(item => {
//         const platform = platforms.find(p => p.providerid === item.providerid);
//         if (platform) {
//           initialValues[platform.field] = item.handleslink;
//         }
//       });

//       form.setFieldsValue(initialValues);
//     }
//   }, [data, platforms, form]);
//   // const handleFormChange = (_, allValues) => {
//   //   setIsFormChanged(true);
//   // };

//   return (
//     <div className="bg-white p-6 rounded-3xl">
//       <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Connect Your Social Media</h2>
//       <p className="text-gray-500 mb-6">Let’s connect your social media profiles to help us understand your reach better.</p>

//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={onFinish}
//         onFinishFailed={({ errorFields }) => {
//           if (errorFields.length > 0) {
//             form.scrollToField(errorFields[0].name, {
//               behavior: "smooth",
//               block: "center",
//             });
//           }
//         }}
//         onValuesChange={(_, allValues) => {
//           setIsFormChanged(true);

//           const socialData = platforms
//             .filter(p => allValues[p.field])
//             .map(p => ({
//               providerid: p.providerid,
//               handleslink: allValues[p.field],
//             }));

//           onChange?.(socialData);
//         }}
//       >
//         <div className="space-y-4">
//           {platforms.map((platform) => (

//             <div key={platform.field} className="flex flex-row items-center gap-3">
//               <div className="flex items-center gap-2 min-w-[40px] md:min-w-[150px] border border-gray-200 rounded-lg px-4 py-2">
//                 {platform.icon}
//                 <span className="hidden md:block text-sm font-medium text-gray-700">{platform.name}</span>
//               </div>
//               <Form.Item
//                 style={{ margin: 0, width: "100%" }}
//                 name={platform.field}
//                 rules={[
//                   {
//                     validator(_, value) {
//                       if (!value) return Promise.resolve();

//                       let normalizedValue = value;

//                       // Auto prepend https:// if missing
//                       if (!/^https?:\/\//i.test(value)) {
//                         normalizedValue = `https://${value}`;
//                       }

//                       let url;
//                       try {
//                         url = new URL(normalizedValue);
//                       } catch {
//                         return Promise.reject(new Error("Please enter a valid URL"));
//                       }

//                       const hostname = url.hostname.replace(/^www\./, "").toLowerCase();

//                       const platformDomains = {
//                         instagram: ["instagram.com"],
//                         facebook: ["facebook.com"],
//                         twitter: ["twitter.com", "x.com"],
//                         linkedin: ["linkedin.com"],
//                         youtube: ["youtube.com", "youtu.be"],
//                       };

//                       const platformKey = platform.name.toLowerCase().replace(/\s+/g, "");
//                       const allowedDomains = platformDomains[platformKey];

//                       if (allowedDomains && !allowedDomains.some(d => hostname.endsWith(d))) {
//                         return Promise.reject(
//                           new Error(`Please enter a valid ${platform.name} link`)
//                         );
//                       }

//                       return Promise.resolve();
//                     }

//                   },
//                 ]}
//               >
//                 <Input
//                   size="large"
//                   placeholder={platform.placeholder}
//                   className="flex-1 border-none shadow-none bg-transparent focus:ring-0 focus:outline-none"
//                 />
//               </Form.Item>


//             </div>

//           ))}
//         </div>

//         {/* Buttons */}
//         <div className="flex flex-row items-center gap-4 mt-6">
//           {/* Back Button (only shown if onBack is provided) */}
//           {onBack && (
//             <button
//               type="button"
//               onClick={onBack}
//               className="bg-white cursor-pointer text-[#0D132D] px-8 py-3 rounded-full hover:text-white border border-[#121a3f26] hover:bg-[#0D132D] transition-colors"
//             >
//               Back
//             </button>
//           )}

//           {/* Next / Save Button */}
//           {(showControls || onNext) && (
//             <button
//               disabled={onNext ? isSubmitting : !isFormChanged || isSubmitting}
//               className={`px-8 py-3 rounded-full text-white font-medium transition
//                 ${(onNext || isFormChanged) && !isSubmitting
//                   ? "bg-[#121A3F] hover:bg-[#0D132D] cursor-pointer"
//                   : "bg-gray-400 cursor-not-allowed"
//                 }`}
//             >
//               {isSubmitting ? <Spin size="small" /> : onNext ? "Continue" : "Save Changes"}
//             </button>
//           )}

//           <button
//             type="button"
//             onClick={handleSkip}
//             disabled={isSubmitting}
//             className={`px-8 py-3 rounded-full text-[#0D132D] font-medium transition border border-[#121a3f26] hover:bg-[#0D132D] hover:text-white ${isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"
//               }`}
//           >
//             {isSubmitting ? <Spin size="small" /> : "Skip"}
//           </button>

//         </div>
//       </Form >
//     </div >
//   );
// };





import React, { useEffect, useState } from 'react';
import { Form, Input, Spin } from 'antd';
import axios from 'axios';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { toast } from 'react-toastify';

export const SocialMediaDetails = ({ onBack, onNext, data, onChange, showControls, showToast, onSave }) => {
  const [providers, setProviders] = useState([])
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState(false);

  const { token } = useSelector(state => state.auth);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const getAllPlatforms = async () => {
    try {
      const res = await axios.get("providers")
      setProviders(res.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getAllPlatforms()
  }, [])

  const platforms = useMemo(() => {
    return providers.map((provider) => {
      const field = provider.name.toLowerCase().replace(/\s+/g, ''); // sanitize field name
      return {
        name: provider.name,
        providerid: provider.id,
        icon: (
          <img
            src={provider.iconpath}
            alt={provider.name}
            className="w-[24px]"
            onError={(e) => (e.target.src = "/Brocken-Defualt-Img.jpg")}
          />
        ),
        field,
        placeholder: `Enter your ${provider.name} link`,
      };
    });
  }, [providers, BASE_URL]);

  const onFinish = async (values) => {
    try {
      setIsSubmitting(true);
      // Transform filled values into required array
      const providersjson = platforms
        .filter(p => values[p.field]) // Only filled-in links
        .map(p => ({
          providerid: p.providerid,
          handleslink: values[p.field],
        }));

      const formData = new FormData();
      formData.append('providersjson', JSON.stringify(providersjson));

      if (providersjson.length === 0) {
        // Only send skipped flag if user didn't enter any links
        formData.append('providersjsonskipped', true);
      }

      const response = await axios.post(
        'vendor/complete-vendor-profile', // replace with actual URL
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        const successMessage =
          response?.data?.message || "Profile updated successfully";

        if (showToast) toast.success(successMessage);

        setIsFormChanged(false);

        // Stepper: Go to next
        if (onNext) onNext();

        // Edit Profile: Custom save handler
        if (onSave) onSave();
      }

    } catch (error) {
      console.error('❌ Failed to submit social links:', error);
      message.error('Failed to submit social links.');
    }
    finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    if (data && Array.isArray(data) && platforms.length > 0) {
      const initialValues = {};

      data.forEach(item => {
        const platform = platforms.find(p => p.providerid === item.providerid);
        if (platform) {
          initialValues[platform.field] = item.handleslink;
        }
      });

      form.setFieldsValue(initialValues);
    }
  }, [data, platforms, form]);

  return (
    <div className="bg-white p-6 rounded-3xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Connect Your Social Media</h2>
      <p className="text-gray-500 mb-6">Let’s connect your social media profiles to help us understand your reach better.</p>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={({ errorFields }) => {
          if (errorFields.length > 0) {
            form.scrollToField(errorFields[0].name, {
              behavior: "smooth",
              block: "center",
            });
          }
        }}
        onValuesChange={(_, allValues) => {
          setIsFormChanged(true);

          const socialData = platforms
            .filter(p => allValues[p.field])
            .map(p => ({
              providerid: p.providerid,
              handleslink: allValues[p.field],
            }));

          onChange?.(socialData);
        }}
      >
        <div className="space-y-4">
          {platforms.map((platform) => (

            <div key={platform.field} className="flex flex-row items-center gap-3">
              <div className="flex items-center gap-2 min-w-[40px] md:min-w-[150px] border border-gray-200 rounded-lg px-4 py-2">
                {platform.icon}
                <span className="hidden md:block text-sm font-medium text-gray-700">{platform.name}</span>
              </div>
              <Form.Item
                style={{ margin: 0, width: "100%" }}
                name={platform.field}
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve(); // allow empty URL

                      // Validate that the link starts with http://, https://, or www.
                      if (!value.startsWith('http://') && !value.startsWith('https://') && !value.startsWith('www.')) {
                        return Promise.reject(new Error("Link must start with http://, https://, or www."));
                      }

                      let normalizedValue = value.startsWith("http") ? value : `https://${value}`;

                      try {
                        new URL(normalizedValue); // if invalid URL, throws
                      } catch {
                        return Promise.reject(new Error("Invalid link"));
                      }

                      const lowerValue = value.toLowerCase();
                      const platformKey = platform.name.toLowerCase().replace(/\s+/g, '');

                      if (!lowerValue.includes(platformKey)) {
                        return Promise.reject(new Error(`This link must be for ${platform.name}`));
                      }

                      return Promise.resolve();
                    }
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder={platform.placeholder}
                  className="flex-1 border-none shadow-none bg-transparent focus:ring-0 focus:outline-none"
                />
              </Form.Item>


            </div>

          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-row items-center gap-4 mt-6">
          {/* Back Button (only shown if onBack is provided) */}
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="bg-white cursor-pointer text-[#0D132D] px-8 py-3 rounded-full hover:text-white border border-[#121a3f26] hover:bg-[#0D132D] transition-colors"
            >
              Back
            </button>
          )}


          {/* Next / Save Button */}
          {(showControls || onNext) && (
            <button
              type="submit"
              disabled={onNext ? isSubmitting : !isFormChanged || isSubmitting}
              className={`px-8 py-3 rounded-full text-white font-medium transition
                ${(onNext || isFormChanged) && !isSubmitting
                  ? "bg-[#121A3F] hover:bg-[#0D132D] cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              {isSubmitting ? <Spin size="small" /> : onNext ? "Continue" : "Save Changes"}
            </button>
          )}

        </div>
      </Form >
    </div >
  );
};