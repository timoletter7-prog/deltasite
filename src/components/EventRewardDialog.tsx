import { useEffect } from 'react';
import { useToast } from '../hooks/use-toast';
import { getShopItemByName } from '../lib/supabase';

const EventRewardDialog = ({ isOpen, rewardItem, setIsLoading, setShopItems }) => {
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && rewardItem) {
      loadRewardItem();
    }
  }, [isOpen, rewardItem]);

  const loadRewardItem = async () => {
    setIsLoading(true);
    try {
      const item = await getShopItemByName(rewardItem);
      if (item) {
        setShopItems([item]);
      } else {
        setShopItems([]);
      }
    } catch (error) {
      toast({
        title: "Fout bij laden",
        description: "Kon beloning niet laden",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add the rest of the component code here, like the JSX return
  return null; // placeholder
};

export default EventRewardDialog;
