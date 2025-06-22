class TokenManager {

  private accessToken: string | null = null;
  private sessionId: string | null = null;

  constructor(){
    if(typeof window !== "undefined"){
      this.sessionId = localStorage.getItem("sessionId");
    }
  }

  setTokens(accessToken: string, sessionId: string): void{

    this.accessToken = accessToken;
    this.sessionId = sessionId;

    if(typeof window !== "undefined"){
      localStorage.setItem("FR-Session", sessionId);
    }
  }

  async refreshAccessToken(): Promise<string>{

    const sessionId = typeof window !== 'undefined' 
          ? localStorage.getItem('sessionId') 
          : this.sessionId;

    if (!sessionId) {
      throw new Error('No session');
    }

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });

    if (!response.ok) {
      this.logout();
      throw new Error('Refresh failed');
    }

    const { accessToken }: { accessToken: string } = await response.json();
    this.accessToken = accessToken;

    return accessToken;
  
  }

  logout(): void {
    this.accessToken = null;
    this.sessionId = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sessionId');
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  hasValidSession(): boolean {
    return !!this.sessionId || !!(typeof window !== 'undefined' && localStorage.getItem('sessionId'));
  }

}

export default TokenManager;