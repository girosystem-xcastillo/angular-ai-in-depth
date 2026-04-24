import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { StartConversationResponse, ContinueConversationResponse } from './chat.model';
import { SKIP_GLOBAL_LOADING } from '../shared/interceptors/loading.interceptor';

const skipLoading = { context: new HttpContext().set(SKIP_GLOBAL_LOADING, true) };

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);

  async startConversation(promptId: string, message: string) {
    return await firstValueFrom(
      this.http.post<StartConversationResponse>('/api/start-conversation', { promptId, message }, skipLoading)
    );
  }

  async continueConversation(conversationId: string, message: string) {
    return await firstValueFrom(
      this.http.post<ContinueConversationResponse>('/api/continue-conversation', { conversationId, message }, skipLoading)
    );
  }
}
