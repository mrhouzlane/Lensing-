use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use std::str::from_utf8;

declare_id!("GFAc6E2LVWue2bqoJZfFCofP9vwVfyGXsnTvD7ojPbBc");

#[program]
pub mod russian {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        let blog_acc = &mut ctx.accounts.blog_account;
        blog_acc.authority = *ctx.accounts.authority.key;
        Ok(())
    }

    pub fn make_post(
        ctx: Context<MakePost>,
        new_post: Vec<u8>
    )-> ProgramResult {
        // post 
        let post = from_utf8(&new_post).map_err(|err| {
            msg!("Invalid UTF-8, from byte {}", err.valid_up_to());
            ProgramError::InvalidInstructionData
        })?;
        msg!(post);

        let blog_acc = &mut ctx.accounts.blog_account;
        blog_acc.latest_post = new_post;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info>{
    #[account(
        init,
        payer = authority,
        space = 8 // account disc
        + 32 // pubkey 
        + 500 // post is 455 bytes  ( an unsigned instruction can support single-byte UTF-8 of up to 566 byte )
    )]
    pub blog_account: Account<'info, BlogAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>, 

}

#[derive(Accounts)]
pub struct MakePost<'info> {
    #[account(mut,
    has_one = authority)]
    pub blog_account: Account<'info, BlogAccount>,
    pub authority: Signer<'info>,
}

#[account]
pub struct BlogAccount {
    pub latest_post: Vec<u8>,
    pub authority: Pubkey
}
