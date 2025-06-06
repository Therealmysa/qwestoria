
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useReferrals } from "@/hooks/useReferrals";

interface ReferralInputProps {
  onReferralValidated: (referrerId: string) => void;
  disabled?: boolean;
}

const ReferralInput = ({ onReferralValidated, disabled }: ReferralInputProps) => {
  const [code, setCode] = useState("");
  const [validatedReferrer, setValidatedReferrer] = useState<{ id: string; username: string } | null>(null);
  const { validateReferralCode } = useReferrals();

  const handleValidation = async () => {
    if (!code.trim()) return;

    try {
      const referrer = await validateReferralCode.mutateAsync(code);
      setValidatedReferrer(referrer);
      onReferralValidated(referrer.id);
    } catch (error) {
      console.error('Erreur validation code:', error);
    }
  };

  const handleInputChange = (value: string) => {
    setCode(value.toUpperCase());
    // Reset validation si l'utilisateur modifie le code
    if (validatedReferrer) {
      setValidatedReferrer(null);
      onReferralValidated('');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Code de parrainage (optionnel)"
          value={code}
          onChange={(e) => handleInputChange(e.target.value)}
          disabled={disabled || !!validatedReferrer}
          className="uppercase"
          maxLength={8}
        />
        {!validatedReferrer && (
          <Button
            type="button"
            variant="outline"
            onClick={handleValidation}
            disabled={!code.trim() || validateReferralCode.isPending || disabled}
          >
            {validateReferralCode.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Vérifier"
            )}
          </Button>
        )}
      </div>

      {/* Messages de statut */}
      {validateReferralCode.isError && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Code de parrainage invalide. Vérifiez et réessayez.
          </AlertDescription>
        </Alert>
      )}

      {validatedReferrer && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Code valide ! Tu seras parrainé par <strong>{validatedReferrer.username}</strong> et recevras 50 BradCoins bonus à l'inscription.
          </AlertDescription>
        </Alert>
      )}

      {/* Information */}
      <p className="text-xs text-gray-500">
        Si tu as un code de parrainage, utilise-le pour recevoir 50 BradCoins gratuits !
      </p>
    </div>
  );
};

export default ReferralInput;
