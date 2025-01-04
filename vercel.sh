#!/bin/bash


# Vercel > project > settings > git > ignored build step
# https://vercel.com/guides/how-do-i-use-the-ignored-build-step-field-on-vercel
# Build now managed from 'deploy-production.yml' action.
echo "VERCEL_ENV: $VERCEL_ENV"
echo "🛑 - Build cancelled"
echo "Production build is now managed from 'deploy-production.yml' action"
exit 0;

# if [[ "$VERCEL_ENV" == "production" ]] ; then
#   # Proceed with the build
#   echo "✅ - Build can proceed"
#   exit 1;

# else
#   # Don't build
#   echo "🛑 - Build cancelled"
#   exit 0;
# fi
