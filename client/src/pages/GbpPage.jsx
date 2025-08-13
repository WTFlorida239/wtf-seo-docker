import React, { useState } from 'react';
import { generateGbpReply, postGbpReply } from '../services/gbpAPI';

const mockReviews = [
  {
    id: 'review1',
    customerName: 'Alice',
    reviewText: 'This place is amazing! The service was top-notch and the product quality exceeded my expectations. Will definitely be back!',
    sentiment: 'positive',
  },
  {
    id: 'review2',
    customerName: 'Bob',
    reviewText: 'The shipping took almost 3 weeks, which was very frustrating. When the product finally arrived, it was damaged. Very disappointed.',
    sentiment: 'negative',
  },
];

const ReviewCard = ({ review }) => {
  const [reply, setReply] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const handleGenerateReply = async () => {
    setIsLoading(true);
    try {
      const res = await generateGbpReply(review.id, {
        reviewText: review.reviewText,
        customerName: review.customerName,
        businessName: 'Our Awesome Store', // This would come from user settings
        sentiment: review.sentiment,
      });
      setReply(res.suggestion);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
    setIsLoading(false);
  };

  const handlePostReply = async () => {
    setIsPosting(true);
    try {
      const res = await postGbpReply(review.id, reply);
      alert(res.message); // Show success message from our simulated backend
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
    setIsPosting(false);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px', borderRadius: '5px' }}>
      <p><strong>From:</strong> {review.customerName}</p>
      <p><em>"{review.reviewText}"</em></p>
      <hr />
      <div>
        <button onClick={handleGenerateReply} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate AI Reply'}
        </button>
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="AI-generated reply will appear here..."
          style={{ width: '100%', minHeight: '80px', marginTop: '10px' }}
        />
        <button onClick={handlePostReply} disabled={!reply || isPosting} style={{ marginTop: '5px' }}>
          {isPosting ? 'Posting...' : 'Approve & Post Reply'}
        </button>
      </div>
    </div>
  );
};


const GbpPage = () => {
  return (
    <div>
      <h1>Google Business Profile - Review Management</h1>
      <p>This page uses mock data since the API to fetch reviews is not yet built.</p>
      <div>
        {mockReviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default GbpPage;
