
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart, CheckCircle } from 'lucide-react';
import { toast } from "sonner";
import { useRouter } from 'next/navigation'

interface BuyCourseButtonProps {
  courseId: string;
  price: number;
  isPurchased?: boolean;
  redirectUrl?: string;
  showIcon?: boolean;
  className?: string;
}

const BuyCourseButton = ({ 
  courseId, 
  price, 
  isPurchased = false, 
  redirectUrl, 
  showIcon = true,
  className = ""
}: BuyCourseButtonProps) => {
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(isPurchased);
  const router = useRouter();

  const handlePurchase = () => {
    setPurchasing(true);
    
    // Simulate purchase delay
    setTimeout(() => {
      // Save purchase to local storage
      const purchasedCourses = JSON.parse(localStorage.getItem('purchased-courses') || '[]');
      if (!purchasedCourses.includes(courseId)) {
        purchasedCourses.push(courseId);
        localStorage.setItem('purchased-courses', JSON.stringify(purchasedCourses));
      }
      
      setPurchasing(false);
      setPurchased(true);
      
      toast.success("Course purchased successfully!", {
        description: "You now have full access to this course",
      });
      
      // Redirect after purchase if URL provided
      if (redirectUrl) {
        // Extract the base URL and append boughtCourse parameter
        if (redirectUrl.includes('?')) {
          // URL already has parameters
          if (redirectUrl.includes('boughtCourse=')) {
            // Replace the value of boughtCourse
            const updatedUrl = redirectUrl.replace(/(boughtCourse=)[^&]+/, '$1true');
            router.push(updatedUrl);
          } else {
            // URL has parameters but not boughtCourse
             router.push(redirectUrl + '&boughtCourse=true');
          }
        } else {
          // URL has no parameters
           router.push(redirectUrl + '?boughtCourse=true');
        }
      }
    }, 1500);
  };

  if (purchased) {
    return (
      <Button 
        variant="outline" 
        className={`${className} bg-green-500/10 text-green-500 border-green-500/30 hover:bg-green-500/20 hover:text-green-600`}
        disabled
      >
        {showIcon && <CheckCircle className="mr-2 h-4 w-4" />}
        Purchased
      </Button>
    );
  }

  return (
    <Button 
      onClick={handlePurchase} 
      disabled={purchasing}
      className={className}
    >
      {purchasing ? (
        <>Loading...</>
      ) : (
        <>
          {showIcon && <ShoppingCart className="mr-2 h-4 w-4" />}
          Buy for ${price.toFixed(2)}
        </>
      )}
    </Button>
  );
};

export default BuyCourseButton;
